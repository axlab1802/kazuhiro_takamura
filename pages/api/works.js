import { getWorks } from '../../lib/worksStore.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const works = await getWorks();

    // Return works from Redis
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
