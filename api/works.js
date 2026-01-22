import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.REDIS_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get works from Redis
    let works = await redis.get('works');

    // If no works in Redis, return the static JSON data
    if (!works) {
      // Fetch from static JSON file
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/works-data.json`);
      const data = await response.json();
      
      return res.status(200).json({
        collection: data.collection,
        works: data.works,
      });
    }

    // Return works from KV
    return res.status(200).json({
      collection: {
        title: "高村和弘 作品集",
        subtitle: "〜いくつもの夜を越えて〜",
        closing: {
          quote: "「俺ってまだでしょ？」",
          message: "これからも、もっといい作品を作っていくよ。油で汚れた手が、今は花の茎を握ってる。それだけでも、俺は幸せなんだ。"
        }
      },
      works: works,
    });

  } catch (error) {
    console.error('Works API error:', error);
    return res.status(500).json({ error: 'Failed to fetch works' });
  }
}
