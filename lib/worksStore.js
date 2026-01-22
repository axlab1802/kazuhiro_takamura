import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.REDIS_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

function normalizeWorks(works = []) {
  return works.map((work, index) => ({
    ...work,
    likes: Number.isFinite(work.likes) ? work.likes : 0,
    comments: Array.isArray(work.comments) ? work.comments : [],
    commentsCount: Number.isFinite(work.commentsCount)
      ? work.commentsCount
      : (Array.isArray(work.comments) ? work.comments.length : 0),
    visible: work.visible === false ? false : true,
    order: Number.isFinite(work.order) ? work.order : index,
  }));
}

async function loadWorksFromJson() {
  const raw = await readFile(join(process.cwd(), 'public', 'works-data.json'), 'utf-8');
  const data = JSON.parse(raw);
  return normalizeWorks(data.works || []);
}

export async function getWorks({ includeHidden = false } = {}) {
  let works = await redis.get('works');
  if (!works) {
    works = await loadWorksFromJson();
  }
  const normalized = normalizeWorks(works);
  const filtered = includeHidden ? normalized : normalized.filter((work) => work.visible !== false);
  return filtered.sort((a, b) => a.order - b.order);
}

export async function saveWorks(works) {
  await redis.set('works', works);
}

export async function getWorksRaw() {
  let works = await redis.get('works');
  if (!works) {
    works = await loadWorksFromJson();
  }
  return normalizeWorks(works);
}
