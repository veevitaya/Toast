import { QueryClient, QueryFunction } from "@tanstack/react-query";

const API_TIMEOUT = 15000;

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let text: string;
    try {
      text = (await res.text()) || res.statusText;
    } catch {
      text = res.statusText || "Unknown error";
    }
    throw new Error(`${res.status}: ${text}`);
  }
}

function getAdminHeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem("toast_admin_session");
    if (raw) {
      const session = JSON.parse(raw);
      if (session.loggedIn && session.username) {
        return { "x-admin-token": btoa(`${session.username}:${session._k || ""}`) };
      }
    }
  } catch {}
  return {};
}

export function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = API_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const existingSignal = options.signal;
  if (existingSignal) {
    if (existingSignal.aborted) {
      controller.abort();
    } else {
      existingSignal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = {
    ...getAdminHeaders(),
    ...(data ? { "Content-Type": "application/json" } : {}),
  };
  const res = await fetchWithTimeout(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

function isNetworkError(err: unknown): boolean {
  if (err instanceof TypeError && err.message.includes("fetch")) return true;
  if (err instanceof DOMException && err.name === "AbortError") return true;
  return false;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey, signal }) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_TIMEOUT);
    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const res = await fetch(queryKey.join("/") as string, {
        credentials: "include",
        headers: getAdminHeaders(),
        signal: controller.signal,
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: (failureCount, error) => {
        if (isNetworkError(error) && failureCount < 2) return true;
        return false;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    },
    mutations: {
      retry: false,
    },
  },
});
