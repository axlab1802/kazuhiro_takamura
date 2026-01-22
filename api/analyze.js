import { readFile } from 'node:fs/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const baseSystemPrompt = await readFile(new URL('../systemprompt.md', import.meta.url), 'utf-8');
    const systemPrompt = `${baseSystemPrompt.trim()}\n\n---\n\n出力形式（JSON）：\n{\n  \"title\": \"タイトル（5〜10文字）\",\n  \"description\": \"コメント（150〜250文字、高村さんの語り口で）\"\n}\n\n重要：\n- JSONのみを出力してください\n- 説明文やマークダウンは不要です\n- ${titleInstruction}`;

    const userPrompt = `この花の写真を見て、高村和弘さんの語り口でコメントを書いてください。${contextStr}${regenerate ? '\n\n※ 前回とは違う視点でコメントを書いてください。' : ''}`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType: mediaType } },
      userPrompt,
    ]);

    const responseText = result.response.text();
    
    // Try to parse as JSON
    let parsed;
    try {
      // Remove any markdown code blocks if present
      const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      // If parsing fails, try to extract title and description
      const titleMatch = responseText.match(/"title"\s*:\s*"([^"]+)"/);
      const descMatch = responseText.match(/"description"\s*:\s*"([^"]+)"/);
      
      parsed = {
        title: titleMatch ? titleMatch[1] : (title || '無題'),
        description: descMatch ? descMatch[1] : responseText.slice(0, 250),
      };
    }

    return res.status(200).json(parsed);

  } catch (error) {
    console.error('Analyze error:', error);
    return res.status(500).json({ error: 'Failed to analyze image' });
  }
}
