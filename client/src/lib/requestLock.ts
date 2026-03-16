const activeLocks = new Map<string, boolean>();

export function isLocked(key: string): boolean {
  return activeLocks.get(key) === true;
}

export function acquireLock(key: string): boolean {
  if (activeLocks.get(key)) return false;
  activeLocks.set(key, true);
  return true;
}

export function releaseLock(key: string): void {
  activeLocks.delete(key);
}

export async function withLock<T>(key: string, fn: () => Promise<T>): Promise<T | null> {
  if (!acquireLock(key)) return null;
  try {
    return await fn();
  } finally {
    releaseLock(key);
  }
}

export function useDebounceAction(delayMs = 300): (fn: () => void) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (fn: () => void) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, delayMs);
  };
}

const tapTimestamps = new Map<string, number>();

export function throttleTap(key: string, minIntervalMs = 400): boolean {
  const now = Date.now();
  const last = tapTimestamps.get(key) || 0;
  if (now - last < minIntervalMs) return false;
  tapTimestamps.set(key, now);
  return true;
}
