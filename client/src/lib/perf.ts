const IS_DEV = import.meta.env.DEV;

const timings: Record<string, number> = {};

export function markStart(label: string): void {
  timings[label] = performance.now();
}

export function markEnd(label: string): number {
  const start = timings[label];
  if (start == null) return -1;
  const duration = Math.round(performance.now() - start);
  delete timings[label];
  if (IS_DEV) {
    console.debug(`[perf] ${label}: ${duration}ms`);
  }
  return duration;
}

export function measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
  markStart(label);
  return fn().then(
    (result) => { markEnd(label); return result; },
    (err) => { markEnd(label); throw err; }
  );
}

let appStartTime = 0;
export function recordAppStart(): void {
  appStartTime = performance.now();
}

export function getTimeSinceAppStart(): number {
  return appStartTime > 0 ? Math.round(performance.now() - appStartTime) : -1;
}

recordAppStart();
