import { readFile } from 'node:fs/promises';
import { Redis } from '@upstash/redis';

function resolveRedisEnv() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.REDIS_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error('Redis env vars are missing. Set UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL/KV_REST_API_TOKEN.');
  }
  return { url, token };
}

async function main() {
  const { url, token } = resolveRedisEnv();
  const redis = new Redis({ url, token });

  const raw = await readFile(new URL('../public/works-data.json', import.meta.url), 'utf-8');
  const data = JSON.parse(raw);
  const works = data.works || [];

  if (!Array.isArray(works) || works.length === 0) {
    throw new Error('works-data.json has no works array or it is empty.');
  }

  await redis.set('works', works);
  console.log(`Seeded ${works.length} works into Redis key "works".`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
