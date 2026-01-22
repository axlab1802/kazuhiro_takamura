import { getWorksRaw, saveWorks } from '../../lib/worksStore.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }

    const works = await getWorksRaw();
    const targetIndex = works.findIndex((work) => String(work.id) === String(id));

    if (targetIndex === -1) {
      return res.status(404).json({ error: 'Work not found' });
    }

    works[targetIndex].likes = (works[targetIndex].likes || 0) + 1;

    await saveWorks(works);

    return res.status(200).json({
      success: true,
      likes: works[targetIndex].likes,
    });
  } catch (error) {
    console.error('Like error:', error);
    return res.status(500).json({ error: 'Failed to like work' });
  }
}
