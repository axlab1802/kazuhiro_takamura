import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, title, description } = req.body;

    if (!imageUrl || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get current works from KV
    let works = await kv.get('works');
    
    // If no works exist yet, initialize from the JSON file
    if (!works) {
      // Fetch the initial works data
      const response = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/works-data.json`);
      const data = await response.json();
      works = data.works || [];
    }

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
    };

    // Add to beginning of array (newest first)
    works.unshift(newWork);

    // Save to KV
    await kv.set('works', works);

    return res.status(200).json({
      success: true,
      work: newWork,
    });

  } catch (error) {
    console.error('Approve error:', error);
    return res.status(500).json({ error: 'Failed to save work' });
  }
}
