import liff from "@line/liff";

const LIFF_ID = import.meta.env.VITE_LIFF_ID || "";

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

let initialized = false;
let initPromise: Promise<void> | null = null;
let cachedProfile: LineProfile | null = null;

export function isLiffAvailable(): boolean {
  return !!LIFF_ID;
}

export async function initLiff(): Promise<boolean> {
  if (!LIFF_ID) return false;
  if (initialized) return true;

  if (!initPromise) {
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

export function isLoggedIn(): boolean {
  if (!initialized) return false;
  return liff.isLoggedIn();
}

export function login(): void {
  if (!initialized) return;
  liff.login();
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

export async function shareMessage(text: string): Promise<boolean> {
  if (!initialized) return false;
  try {
    if (!liff.isApiAvailable("shareTargetPicker")) {
      const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
      window.open(lineUrl, "_blank");
      return true;
    }
    await liff.shareTargetPicker([
      { type: "text", text },
    ]);
    return true;
  } catch (err) {
    console.error("Failed to share:", err);
    return false;
  }
}

export async function sendInvite(mode: string): Promise<boolean> {
  const appUrl = window.location.origin;
  const message = `Join me on Toast!\n\nLet's decide what to eat together. I'm swiping on ${mode} mode right now!\n\n${appUrl}/swipe?mode=${mode}`;
  return shareMessage(message);
}

export async function sendGroupInvite(sessionId: string): Promise<boolean> {
  const appUrl = window.location.origin;
  const message = `Toast Group Session!\n\nJoin our food swiping session and let's find the perfect meal together!\n\n${appUrl}/group/waiting?session=${sessionId}`;
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
