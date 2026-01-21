import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, title, recipient, situation, notes, regenerate } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // Determine media type
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const mediaType = contentType.includes('png') ? 'image/png' : 'image/jpeg';

    // Build the prompt
    const contextParts = [];
    if (recipient) contextParts.push(`贈り先: ${recipient}`);
    if (situation) contextParts.push(`シチュエーション: ${situation}`);
    if (notes) contextParts.push(`補足メモ: ${notes}`);

    const contextStr = contextParts.length > 0 
      ? `\n\n【入力情報】\n${contextParts.join('\n')}`
      : '';

    const titleInstruction = title 
      ? `タイトルは「${title}」を使用してください。`
      : 'タイトルは5〜10文字程度で、作品の雰囲気を表現するものを提案してください。';

    const systemPrompt = `あなたは高村和弘さんのフラワーアレンジメント作品のコメントを代筆するアシスタントです。

高村さんのプロフィール：
- 1977年生まれ、千葉県飯岡（現・旭市）出身
- 中学卒業後、15歳で社会に出る
- 自動車整備士 → ガソリンスタンド → 大型トラックドライバー → フラワーデザイナーという経歴
- バンド活動で奥さんと出会い、二人の娘がいる
- 働きながら高卒認定を取得
- フラワーデザイナー1級を8回目の挑戦で取得
- 現在は家族で「フラワーさやか」という花屋を営んでいる

コメントの特徴：
- 一人称は「俺」
- 人情味があり、温かみのある語り口
- 過去の経験（整備士、トラック運転手など）を花に重ねることがある
- 家族への愛情が感じられる
- 「俺ってまだでしょ？」という口癖がある
- 飯岡の海や星空など、故郷の風景を思い出すことがある

出力形式（JSON）：
{
  "title": "タイトル（5〜10文字）",
  "description": "コメント（150〜250文字、高村さんの語り口で）"
}

重要：
- JSONのみを出力してください
- 説明文やマークダウンは不要です
- ${titleInstruction}`;

    const userPrompt = `この花の写真を見て、高村和弘さんの語り口でコメントを書いてください。${contextStr}${regenerate ? '\n\n※ 前回とは違う視点でコメントを書いてください。' : ''}`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: userPrompt,
            },
          ],
        },
      ],
      system: systemPrompt,
    });

    // Parse the response
    const responseText = message.content[0].text;
    
    // Try to parse as JSON
    let result;
    try {
      // Remove any markdown code blocks if present
      const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(jsonStr);
    } catch {
      // If parsing fails, try to extract title and description
      const titleMatch = responseText.match(/"title"\s*:\s*"([^"]+)"/);
      const descMatch = responseText.match(/"description"\s*:\s*"([^"]+)"/);
      
      result = {
        title: titleMatch ? titleMatch[1] : (title || '無題'),
        description: descMatch ? descMatch[1] : responseText.slice(0, 250),
      };
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('Analyze error:', error);
    return res.status(500).json({ error: 'Failed to analyze image' });
  }
}
