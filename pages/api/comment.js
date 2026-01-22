import { getWorksRaw, saveWorks } from '../../lib/worksStore.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, text, name } = req.body;
    if (!id || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const commentText = String(text).trim();
    if (!commentText) {
      return res.status(400).json({ error: 'Empty comment' });
    }

    const works = await getWorksRaw();
    const targetIndex = works.findIndex((work) => String(work.id) === String(id));

    if (targetIndex === -1) {
      return res.status(404).json({ error: 'Work not found' });
    }

    const comment = {
      id: Date.now(),
      text: commentText,
      name: typeof name === 'string' ? name.trim() : '',
      createdAt: new Date().toISOString(),
    };

    const existingComments = Array.isArray(works[targetIndex].comments) ? works[targetIndex].comments : [];
    works[targetIndex].comments = [comment, ...existingComments];
    works[targetIndex].commentsCount = (works[targetIndex].commentsCount || 0) + 1;

    await saveWorks(works);

    return res.status(200).json({
      success: true,
      commentsCount: works[targetIndex].commentsCount,
    });
  } catch (error) {
    console.error('Comment error:', error);
    return res.status(500).json({ error: 'Failed to add comment' });
  }
}
