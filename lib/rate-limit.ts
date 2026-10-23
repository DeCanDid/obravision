const failures = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function isLocked(key: string) {
  const entry = failures.get(key);
  if (!entry || entry.resetAt < Date.now()) return false;
  return entry.count >= LIMIT;
}

export function recordFailure(key: string) {
  const now = Date.now();
  const entry = failures.get(key);
  if (!entry || entry.resetAt < now) failures.set(key, { count: 1, resetAt: now + WINDOW_MS });
  else entry.count++;
}

export function clearFailures(key: string) {
  failures.delete(key);
}