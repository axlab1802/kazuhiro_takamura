import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.REDIS_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

const PROMPT_KEY = 'systemPrompt';

export async function getSystemPrompt() {
  const stored = await redis.get(PROMPT_KEY);
  if (stored && typeof stored === 'string') {
    return stored;
  }
  return await readFile(join(process.cwd(), 'systemprompt.md'), 'utf-8');
}

export async function setSystemPrompt(value) {
  await redis.set(PROMPT_KEY, value);
}
