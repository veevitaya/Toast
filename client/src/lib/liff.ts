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

function getAppBaseUrl(): string {
  const hostname = window.location.hostname;
  if (hostname === "letstoast.app" || hostname.endsWith(".letstoast.app")) {
    return PRODUCTION_DOMAIN;
  }
  return window.location.origin;
}

export function getGroupInviteUrl(sessionId: string): string {
  return `${getAppBaseUrl()}/group/waiting?session=${sessionId}`;
}

function getRedirectUri(): string {
  return window.location.href;
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

function buildGroupInviteFlexMessage(joinUrl: string): any {
  return {
    type: "flex",
    altText: "Toast Group Session! Tap to join our food swiping session.",
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "20px",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: "\uD83C\uDF5E",
                size: "3xl",
                flex: 0,
              },
              {
                type: "box",
                layout: "vertical",
                flex: 1,
                contents: [
                  {
                    type: "text",
                    text: "Toast Group Session!",
                    weight: "bold",
                    size: "lg",
                    color: "#2D2000",
                  },
                  {
                    type: "text",
                    text: "You're invited to swipe",
                    size: "sm",
                    color: "#888888",
                  },
                ],
              },
            ],
            spacing: "lg",
            alignItems: "center",
          },
          {
            type: "separator",
            margin: "lg",
          },
          {
            type: "text",
            text: "Join our food swiping session and let\u2019s find the perfect meal together!",
            size: "sm",
            color: "#555555",
            wrap: true,
            margin: "lg",
          },
          {
            type: "button",
            action: {
              type: "uri",
              label: "Tap to Join!",
              uri: joinUrl,
            },
            style: "primary",
            color: "#FFCC02",
            height: "md",
            margin: "lg",
          },
        ],
      },
      styles: {
        body: {
          backgroundColor: "#FFFDF5",
        },
      },
    },
  };
}

function buildInviteFlexMessage(mode: string, appUrl: string): any {
  const swipeUrl = `${appUrl}/swipe?mode=${mode}`;
  return {
    type: "flex",
    altText: `Join me on Toast! Let's decide what to eat together.`,
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "20px",
        contents: [
          {
            type: "text",
            text: "\uD83C\uDF5E Join me on Toast!",
            weight: "bold",
            size: "lg",
            color: "#2D2000",
          },
          {
            type: "text",
            text: `Let's decide what to eat together. I'm swiping on ${mode} mode right now!`,
            size: "sm",
            color: "#555555",
            wrap: true,
            margin: "md",
          },
          {
            type: "button",
            action: {
              type: "uri",
              label: "Join Now!",
              uri: swipeUrl,
            },
            style: "primary",
            color: "#FFCC02",
            height: "md",
            margin: "lg",
          },
        ],
      },
      styles: {
        body: {
          backgroundColor: "#FFFDF5",
        },
      },
    },
  };
}

async function tryShareTargetPicker(messages: any[]): Promise<ShareResult | null> {
  if (!initialized || !liff.isLoggedIn()) return null;
  try {
    if (liff.isApiAvailable("shareTargetPicker")) {
      const result = await liff.shareTargetPicker(messages);
      if (result && "status" in result && result.status === "success") {
        return { shared: true, method: "liff" };
      }
      return { shared: false, method: "liff" };
    }
  } catch (err) {
    console.error("shareTargetPicker failed:", err);
  }
  return null;
}

const isMobileDevice = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function openLineSharePopup(shareUrl: string, fallbackText: string): ShareResult | null {
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fallbackText)}`;
  const popup = window.open(lineUrl, "_blank", "width=500,height=600");
  if (popup) return { shared: true, method: "line-app" };
  return null;
}

function openLineAppShare(fullText: string): ShareResult {
  const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(fullText)}`;
  window.open(lineUrl, "_blank");
  return { shared: true, method: "line-app" };
}

async function copyToClipboard(text: string): Promise<ShareResult> {
  try {
    await navigator.clipboard.writeText(text);
    return { shared: true, method: "clipboard" };
  } catch {
    return { shared: false, method: "clipboard" };
  }
}

export async function shareMessage(text: string): Promise<ShareResult> {
  const ready = await initLiff();

  if (ready && initialized) {
    const result = await tryShareTargetPicker([{ type: "text", text }]);
    if (result) return result;
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(text)}`;
    window.location.href = lineUrl;
    return { shared: true, method: "line-app" };
  }

  const popupResult = openLineSharePopup(window.location.origin, text);
  if (popupResult) return popupResult;
  return copyToClipboard(text);
}

export async function sendGroupInviteNoRedirect(sessionId: string): Promise<ShareResult> {
  const joinUrl = getGroupInviteUrl(sessionId);
  const plainText = `Toast Group Session!\n\nJoin our food swiping session and let\u2019s find the perfect meal together!\n\nTap to join:\n${joinUrl}`;

  if (initialized && liff.isLoggedIn()) {
    const flexMsg = buildGroupInviteFlexMessage(joinUrl);
    const result = await tryShareTargetPicker([flexMsg]);
    if (result) return result;
  }

  if (isMobileDevice()) {
    return openLineAppShare(plainText);
  }

  const popupResult = openLineSharePopup(joinUrl, plainText);
  if (popupResult) return popupResult;
  return copyToClipboard(plainText);
}

export async function sendInvite(mode: string): Promise<ShareResult> {
  const appUrl = getAppBaseUrl();
  const swipeUrl = `${appUrl}/swipe?mode=${mode}`;
  const plainText = `Join me on Toast!\n\nLet's decide what to eat together. I'm swiping on ${mode} mode right now!\n\n${swipeUrl}`;

  if (initialized && liff.isLoggedIn()) {
    const flexMsg = buildInviteFlexMessage(mode, appUrl);
    const result = await tryShareTargetPicker([flexMsg]);
    if (result) return result;
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(plainText)}`;
    window.location.href = lineUrl;
    return { shared: true, method: "line-app" };
  }

  const popupResult = openLineSharePopup(swipeUrl, plainText);
  if (popupResult) return popupResult;
  return copyToClipboard(plainText);
}

export async function sendGroupInvite(sessionId: string): Promise<ShareResult> {
  const joinUrl = getGroupInviteUrl(sessionId);
  const plainText = `Toast Group Session!\n\nJoin our food swiping session and let\u2019s find the perfect meal together!\n\nTap to join:\n${joinUrl}`;

  if (initialized && liff.isLoggedIn()) {
    const flexMsg = buildGroupInviteFlexMessage(joinUrl);
    const result = await tryShareTargetPicker([flexMsg]);
    if (result) return result;
  }

  if (isMobileDevice()) {
    return openLineAppShare(plainText);
  }

  const popupResult = openLineSharePopup(joinUrl, plainText);
  if (popupResult) return popupResult;
  return copyToClipboard(plainText);
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
