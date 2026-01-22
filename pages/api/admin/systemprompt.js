import { getSystemPrompt, setSystemPrompt } from '../../../lib/systemPromptStore.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const prompt = await getSystemPrompt();
      return res.status(200).json({ prompt });
    } catch (error) {
      console.error('System prompt fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch system prompt' });
    }
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid prompt' });
    }
    await setSystemPrompt(prompt);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('System prompt update error:', error);
    return res.status(500).json({ error: 'Failed to update system prompt' });
  }
}
