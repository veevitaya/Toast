import liff from "@line/liff";

const LIFF_ID = import.meta.env.VITE_LIFF_ID || "";
const LINE_OA_LIFF_ID = import.meta.env.VITE_LINE_OA_LIFF_ID || "";
const LINE_OA_CHANNEL_ID = import.meta.env.VITE_LINE_OA_CHANNEL_ID || "";

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface ShareResult {
  shared: boolean;
  method: "liff" | "line-app" | "clipboard";
}

let initialized = false;
let initPromise: Promise<void> | null = null;
let cachedProfile: LineProfile | null = null;
let currentLiffId: string = "";

export function isLiffAvailable(): boolean {
  return !!LIFF_ID;
}

export function isLineOAAvailable(): boolean {
  return !!LINE_OA_LIFF_ID;
}

export function getLineOAChannelId(): string {
  return LINE_OA_CHANNEL_ID;
}

export function getLineOALiffId(): string {
  return LINE_OA_LIFF_ID;
}

export async function initLiff(): Promise<boolean> {
  if (!LIFF_ID) return false;
  if (initialized && currentLiffId === LIFF_ID) return true;

  if (!initPromise || currentLiffId !== LIFF_ID) {
    currentLiffId = LIFF_ID;
    initialized = false;
    initPromise = liff.init({ liffId: LIFF_ID }).then(() => {
      initialized = true;
    }).catch((err) => {
      console.error("LIFF init failed:", err);
      initPromise = null;
    });
  }

  await initPromise;
  return initialized;
}

export async function initLiffOA(): Promise<boolean> {
  const oaId = LINE_OA_LIFF_ID || LIFF_ID;
  if (!oaId) return false;
  if (initialized && currentLiffId === oaId) return true;

  if (!initPromise || currentLiffId !== oaId) {
    currentLiffId = oaId;
    initialized = false;
    initPromise = liff.init({ liffId: oaId }).then(() => {
      initialized = true;
    }).catch((err) => {
      console.error("LIFF OA init failed:", err);
      initPromise = null;
    });
  }

  await initPromise;
  return initialized;
}

const PRODUCTION_DOMAIN = "https://letstoast.app";

function getRedirectUri(): string {
  const currentUrl = new URL(window.location.href);
  if (currentUrl.hostname === "letstoast.app" || currentUrl.hostname.endsWith(".letstoast.app")) {
    return currentUrl.href;
  }
  const productionUrl = new URL(currentUrl.pathname + currentUrl.search, PRODUCTION_DOMAIN);
  return productionUrl.href;
}

export async function ensureLineLogin(): Promise<LineProfile | null> {
  const ready = await initLiffOA();
  if (!ready) return null;

  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri: getRedirectUri() });
    return null;
  }

  const profile = await getProfile();
  if (profile) {
    await syncProfileToServer(profile);
  }
  return profile;
}

export function isLoggedIn(): boolean {
  if (!initialized) return false;
  return liff.isLoggedIn();
}

export function login(): void {
  if (!initialized) return;
  liff.login({ redirectUri: getRedirectUri() });
}

export function logout(): void {
  if (!initialized) return;
  cachedProfile = null;
  liff.logout();
}

export async function getProfile(): Promise<LineProfile | null> {
  if (cachedProfile) return cachedProfile;
  if (!initialized || !liff.isLoggedIn()) return null;
  try {
    const profile = await liff.getProfile();
    cachedProfile = {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    };
    return cachedProfile;
  } catch (err) {
    console.error("Failed to get LINE profile:", err);
    return null;
  }
}

export function getCachedProfile(): LineProfile | null {
  return cachedProfile;
}

export async function ensureLoggedIn(): Promise<LineProfile | null> {
  const ready = await initLiff();
  if (!ready) return null;
  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }
  return getProfile();
}

export async function shareMessage(text: string): Promise<ShareResult> {
  const ready = await initLiff();

  if (ready && initialized) {
    try {
      if (liff.isApiAvailable("shareTargetPicker")) {
        const result = await liff.shareTargetPicker([
          { type: "text", text },
        ]);
        if (result && "status" in result && result.status === "success") {
          return { shared: true, method: "liff" };
        }
        return { shared: false, method: "liff" };
      }
    } catch (err) {
      console.error("shareTargetPicker failed:", err);
    }
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(text)}`;
    window.location.href = lineUrl;
    return { shared: true, method: "line-app" };
  } else {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`;
    const popup = window.open(lineUrl, "_blank", "width=500,height=600");
    if (!popup) {
      return { shared: false, method: "line-app" };
    }
    return { shared: true, method: "line-app" };
  }
}

export async function shareMessageNoRedirect(text: string): Promise<ShareResult> {
  const ready = await initLiff();

  if (ready && initialized) {
    try {
      if (liff.isApiAvailable("shareTargetPicker")) {
        const result = await liff.shareTargetPicker([
          { type: "text", text },
        ]);
        if (result && "status" in result && result.status === "success") {
          return { shared: true, method: "liff" };
        }
        return { shared: false, method: "liff" };
      }
    } catch (err) {
      console.error("shareTargetPicker failed:", err);
    }
  }

  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`;
  const popup = window.open(lineUrl, "_blank", "width=500,height=600");
  if (!popup) {
    try {
      await navigator.clipboard.writeText(text);
      return { shared: true, method: "clipboard" };
    } catch {
      return { shared: false, method: "clipboard" };
    }
  }
  return { shared: true, method: "line-app" };
}

export async function sendGroupInviteNoRedirect(sessionId: string): Promise<ShareResult> {
  const oaLiffId = LINE_OA_LIFF_ID;
  const joinUrl = oaLiffId
    ? `https://liff.line.me/${oaLiffId}/group/waiting?session=${sessionId}`
    : `${window.location.origin}/group/waiting?session=${sessionId}`;

  const message = `Toast Group Session!\n\nJoin our food swiping session and let's find the perfect meal together!\n\nTap to join:\n${joinUrl}`;
  return shareMessageNoRedirect(message);
}

export async function sendInvite(mode: string): Promise<ShareResult> {
  const appUrl = window.location.origin;
  const message = `Join me on Toast!\n\nLet's decide what to eat together. I'm swiping on ${mode} mode right now!\n\n${appUrl}/swipe?mode=${mode}`;
  return shareMessage(message);
}

export async function sendGroupInvite(sessionId: string): Promise<ShareResult> {
  const oaLiffId = LINE_OA_LIFF_ID;
  const joinUrl = oaLiffId
    ? `https://liff.line.me/${oaLiffId}/group/waiting?session=${sessionId}`
    : `${window.location.origin}/group/waiting?session=${sessionId}`;

  const message = `Toast Group Session!\n\nJoin our food swiping session and let's find the perfect meal together!\n\nTap to join:\n${joinUrl}`;
  return shareMessage(message);
}

export function isInLiff(): boolean {
  if (!initialized) return false;
  return liff.isInClient();
}

export function getAccessToken(): string | null {
  if (!initialized) return null;
  return liff.getAccessToken();
}

export async function getAccessTokenAsync(): Promise<string | null> {
  const ready = await initLiff();
  if (!ready) return null;
  return liff.getAccessToken();
}

export async function syncProfileToServer(profile: LineProfile): Promise<void> {
  try {
    const response = await fetch("/api/line/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      console.error("Failed to sync LINE profile to server:", response.status);
    }
  } catch (err) {
    console.error("Failed to sync LINE profile:", err);
  }
}
