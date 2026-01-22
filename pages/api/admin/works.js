import { getWorksRaw, saveWorks } from '../../../lib/worksStore.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const works = await getWorksRaw();
      return res.status(200).json({ works });
    } catch (error) {
      console.error('Admin works fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch works' });
    }
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action } = req.body;
    const works = await getWorksRaw();

    if (action === 'update') {
      const { id, title, description } = req.body;
      const target = works.find((work) => String(work.id) === String(id));
      if (!target) return res.status(404).json({ error: 'Work not found' });
      if (typeof title === 'string') target.title = title;
      if (typeof description === 'string') target.description = description;
    } else if (action === 'replace-image') {
      const { id, imageUrl } = req.body;
      const target = works.find((work) => String(work.id) === String(id));
      if (!target) return res.status(404).json({ error: 'Work not found' });
      if (!imageUrl) return res.status(400).json({ error: 'Missing imageUrl' });
      target.image = imageUrl;
    } else if (action === 'toggle-visibility') {
      const { id, visible } = req.body;
      const target = works.find((work) => String(work.id) === String(id));
      if (!target) return res.status(404).json({ error: 'Work not found' });
      target.visible = Boolean(visible);
    } else if (action === 'delete') {
      const { id } = req.body;
      const target = works.find((work) => String(work.id) === String(id));
      if (!target) return res.status(404).json({ error: 'Work not found' });
      target.visible = false;
      target.deletedAt = new Date().toISOString();
    } else if (action === 'reorder') {
      const { order } = req.body;
      if (!Array.isArray(order)) return res.status(400).json({ error: 'Invalid order' });
      const orderMap = new Map(order.map((workId, index) => [String(workId), index]));
      works.forEach((work, index) => {
        work.order = orderMap.has(String(work.id)) ? orderMap.get(String(work.id)) : index;
      });
      works.sort((a, b) => a.order - b.order);
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const normalized = works.map((work, index) => ({ ...work, order: index }));
    await saveWorks(normalized);

    return res.status(200).json({ success: true, works: normalized });
  } catch (error) {
    console.error('Admin works update error:', error);
    return res.status(500).json({ error: 'Failed to update works' });
  }
}
