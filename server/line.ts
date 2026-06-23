// Minimal LINE Messaging API client (raw fetch, no SDK) used to push group
// decision results to the LINE group or the session members. The channel access
// token MUST belong to the same LINE Official Account whose LIFF issued the
// member userIds, otherwise the userIds are not addressable.

const LINE_PUSH_URL = "https://api.line.me/v2/bot/message/push";
const LINE_MULTICAST_URL = "https://api.line.me/v2/bot/message/multicast";

// Abort a hung LINE request well before the 60s stale-claim window in storage, so
// a slow send can't still be in flight when another trigger re-claims and sends
// again (which would double-post the result).
const LINE_REQUEST_TIMEOUT_MS = 15_000;

export function isLineConfigured(): boolean {
  return !!process.env.LINE_CHANNEL_ACCESS_TOKEN;
}

function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN || ""}`,
  };
}

// Push to a single destination (a userId, groupId, or roomId).
export async function linePush(to: string, messages: unknown[]): Promise<void> {
  const res = await fetch(LINE_PUSH_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ to, messages }),
    signal: AbortSignal.timeout(LINE_REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`LINE push failed (${res.status}): ${body.slice(0, 300)}`);
  }
}

// Multicast to many userIds in one call (LINE caps this at 500 recipients).
// Recipients must have added the Official Account as a friend to receive it.
export async function lineMulticast(to: string[], messages: unknown[]): Promise<void> {
  const recipients = Array.from(new Set(to)).filter(Boolean).slice(0, 500);
  if (recipients.length === 0) throw new Error("No recipients for multicast");
  const res = await fetch(LINE_MULTICAST_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ to: recipients, messages }),
    signal: AbortSignal.timeout(LINE_REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`LINE multicast failed (${res.status}): ${body.slice(0, 300)}`);
  }
}

interface ResultFlexInput {
  headline: string;
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  buttonLabel: string;
  url: string;
}

// Builds a Toast-styled Flex message: gold accent headline on a warm cream card
// with a dark primary action button (matches the app's secondary button style for
// reliable contrast).
export function buildResultFlex(input: ResultFlexInput) {
  const { headline, title, subtitle, imageUrl, buttonLabel, url } = input;

  const bodyContents: Record<string, unknown>[] = [
    { type: "text", text: headline, size: "sm", color: "#B58A00", weight: "bold" },
    { type: "text", text: title, size: "xl", weight: "bold", wrap: true, color: "#1A1A1A", margin: "sm" },
  ];
  if (subtitle) {
    bodyContents.push({ type: "text", text: subtitle, size: "sm", color: "#8A8A8A", wrap: true, margin: "sm" });
  }

  const bubble: Record<string, unknown> = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: "#FFFDF5",
      paddingAll: "20px",
      contents: bodyContents,
    },
    footer: {
      type: "box",
      layout: "vertical",
      backgroundColor: "#FFFDF5",
      paddingAll: "16px",
      paddingTop: "0px",
      contents: [
        {
          type: "button",
          style: "primary",
          color: "#1A1A1A",
          height: "md",
          action: { type: "uri", label: buttonLabel, uri: url },
        },
      ],
    },
  };

  if (imageUrl && /^https:\/\//.test(imageUrl)) {
    bubble.hero = {
      type: "image",
      url: imageUrl,
      size: "full",
      aspectRatio: "20:13",
      aspectMode: "cover",
      action: { type: "uri", label: buttonLabel, uri: url },
    };
  }

  return {
    type: "flex",
    altText: `${headline} ${title}`,
    contents: bubble,
  };
}
