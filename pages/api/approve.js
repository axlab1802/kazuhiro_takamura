import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.REDIS_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, title, description } = req.body;

    if (!imageUrl || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get current works from Redis
    let works = await redis.get('works');
    
    // If no works exist yet, initialize from the JSON file
    if (!works) {
      // Fetch the initial works data (use current host in dev)
      const host = req.headers.host;
      const baseUrl = host
        ? `${host.includes('localhost') ? 'http' : 'https'}://${host}`
        : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:1105');
      const response = await fetch(`${baseUrl}/works-data.json`);
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

    // Save to Redis
    await redis.set('works', works);

    return res.status(200).json({
      success: true,
      work: newWork,
    });

  } catch (error) {
    console.error('Approve error:', error);
    return res.status(500).json({ error: 'Failed to save work' });
  }
}
