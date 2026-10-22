// Tiny in-memory limiter (per server instance) to stop order spam.
const hits = new Map();
export function rateLimit(key, max = 8, windowMs = 60_000) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length <= max;
}
