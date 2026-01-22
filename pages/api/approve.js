import { getWorksRaw, saveWorks } from '../../lib/worksStore.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, title, description } = req.body;

    if (!imageUrl || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get current works from Redis (or JSON fallback)
    let works = await getWorksRaw();

    // Generate new ID
    const maxId = works.reduce((max, work) => Math.max(max, work.id), 0);
    const newId = maxId + 1;

    // Create new work entry
    const newWork = {
      id: newId,
      title: title,
      image: imageUrl,
      description: description,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      commentsCount: 0,
      visible: true,
      order: 0,
    };

    // Add to beginning of array (newest first)
    works.unshift(newWork);

    // Re-assign order to preserve list order
    works = works.map((work, index) => ({ ...work, order: index }));

    // Save to Redis
    await saveWorks(works);

    return res.status(200).json({
      success: true,
      work: newWork,
    });

  } catch (error) {
    console.error('Approve error:', error);
    return res.status(500).json({ error: 'Failed to save work' });
  }
}
