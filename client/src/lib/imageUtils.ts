const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23f3f4f6'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='48'%3E🍽️%3C/text%3E%3C/svg%3E";

export function optimizeImageUrl(url: string | undefined | null, width = 400, quality = 50): string {
  if (!url) return FALLBACK_IMAGE;
  try {
    if (url.includes("unsplash.com")) {
      const base = url.split("?")[0];
      return `${base}?w=${width}&q=${quality}&auto=format&fit=crop`;
    }
    return url;
  } catch {
    return FALLBACK_IMAGE;
  }
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>): void {
  const img = e.currentTarget;
  if (img.src !== FALLBACK_IMAGE) {
    img.src = FALLBACK_IMAGE;
    img.onerror = null;
  }
}

const preloadedUrls = new Set<string>();

export function preloadImage(url: string): void {
  if (!url || typeof window === "undefined" || preloadedUrls.has(url)) return;
  if (preloadedUrls.size > 50) preloadedUrls.clear();
  preloadedUrls.add(url);
  const img = new Image();
  img.src = url;
}

export { FALLBACK_IMAGE };
