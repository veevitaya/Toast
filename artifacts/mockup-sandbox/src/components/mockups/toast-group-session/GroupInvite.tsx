import { useState } from "react";
import { ArrowLeft, Clock, MapPin, Check, Hourglass, Lock } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

type Status = "in" | "waiting";
type Friend = { id: string; name: string; initial: string; status: Status };

const STATUS_META: Record<
  Status,
  { label: string; Icon: typeof Check; fg: string; bg: string; ring: string }
> = {
  in: { label: "Joined", Icon: Check, fg: LINE, bg: "rgba(6,199,85,0.12)", ring: LINE },
  waiting: { label: "Waiting", Icon: Hourglass, fg: MUTE, bg: "#F3F1EC", ring: "#E3DED3" },
};

const WHEN = ["7:00 PM", "8:30 PM", "Lunch tomorrow", "This weekend"];
const WHERE = ["Near BTS Asok", "Thonglor", "Riverside", "At the mall"];

const formatList = (names: string[]): string => {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names.slice(0, 2).join(", ")} & ${names.length - 2} more`;
};

export default function GroupInvite() {
  const [friends, setFriends] = useState<Friend[]>([
    { id: "a", name: "You", initial: "Y", status: "in" },
    { id: "b", name: "Mint", initial: "M", status: "in" },
    { id: "c", name: "Ploy", initial: "P", status: "in" },
    { id: "d", name: "Bank", initial: "B", status: "waiting" },
    { id: "e", name: "Nut", initial: "N", status: "waiting" },
  ]);
  const [whenIdx, setWhenIdx] = useState(0);
  const [whereIdx, setWhereIdx] = useState(0);

  const toggle = (id: string) =>
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: f.status === "in" ? "waiting" : "in" } : f))
    );

  const joinedFriends = friends.filter((f) => f.status === "in");
  const waitingNames = friends.filter((f) => f.status === "waiting").map((f) => f.name);
  const total = friends.length;
  const joinedCount = joinedFriends.length;
  const allHere = waitingNames.length === 0;
  const statusLine = allHere
    ? "Everyone\u2019s here \u2014 lock it in."
    : `Waiting on ${formatList(waitingNames)}`;

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter']"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-14 pb-2">
        <button
          aria-label="Go back"
          data-testid="button-back"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
          Waiting room
        </span>
      </header>

      <main className="flex-1 px-6 pb-40 pt-3">
        <div className="mb-5">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight leading-tight">
            Who&apos;s in?
          </h1>
          <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
            Your crew&apos;s joining from the LINE invite. Lock it in once everyone&apos;s here.
          </p>
        </div>

        {/* Headcount hero */}
        <div
          className="rounded-[28px] bg-white p-5"
          style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}
        >
          {/* Plan strip */}
          <div className="flex items-center gap-2.5 mb-5">
            <button
              data-testid="button-when"
              onClick={() => setWhenIdx((i) => (i + 1) % WHEN.length)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold active:scale-95 transition-transform"
              style={{ backgroundColor: CREAM }}
            >
              <Clock className="w-3.5 h-3.5" style={{ color: MUTE }} /> {WHEN[whenIdx]}
            </button>
            <button
              data-testid="button-where"
              onClick={() => setWhereIdx((i) => (i + 1) % WHERE.length)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold active:scale-95 transition-transform"
              style={{ backgroundColor: CREAM }}
            >
              <MapPin className="w-3.5 h-3.5" style={{ color: MUTE }} /> {WHERE[whereIdx]}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Ring value={joinedCount} total={total} />
            <div className="flex-1 min-w-0">
              <div aria-live="polite">
                <p className="font-['Plus_Jakarta_Sans'] text-[19px] font-bold leading-tight">
                  {joinedCount} of {total} joined
                </p>
                <p className="text-[13.5px] mt-1 leading-snug" style={{ color: MUTE }}>
                  {statusLine}
                </p>
              </div>
              {joinedFriends.length > 0 && (
                <div className="flex -space-x-2 mt-3">
                  {joinedFriends.map((f) => (
                    <span
                      key={f.id}
                      className="w-7 h-7 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[11px] font-bold border-2 border-white"
                      style={{ backgroundColor: "#F3F1EC", color: INK }}
                    >
                      {f.initial}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Crew list */}
        <div
          className="rounded-[28px] bg-white p-5 mt-4"
          style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: MUTE }}>
              The crew · {total}
            </p>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: LINE }}>
              <span className="relative flex w-2 h-2">
                <span
                  className="animate-ping absolute inline-flex w-full h-full rounded-full opacity-60"
                  style={{ backgroundColor: LINE }}
                />
                <span className="relative inline-flex rounded-full w-2 h-2" style={{ backgroundColor: LINE }} />
              </span>
              Live
            </span>
          </div>
          <p className="text-[12px] mt-1 mb-3" style={{ color: MUTE }}>
            Updates live as your crew joins
          </p>

          <div className="space-y-1">
            {friends.map((f) => {
              const m = STATUS_META[f.status];
              const isWaiting = f.status === "waiting";
              return (
                <button
                  key={f.id}
                  data-testid={`crew-${f.id}`}
                  onClick={() => toggle(f.id)}
                  aria-label={`${f.name} has ${m.label.toLowerCase()}. Tap to toggle.`}
                  className="w-full flex items-center gap-3 py-1.5 text-left active:scale-[0.99] transition-transform"
                  style={{ opacity: isWaiting ? 0.62 : 1 }}
                >
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[14px] font-bold shrink-0"
                    style={{
                      backgroundColor: "#F3F1EC",
                      color: INK,
                      boxShadow: `0 0 0 2px #fff, 0 0 0 3.5px ${m.ring}`,
                    }}
                  >
                    {f.initial}
                  </span>
                  <span className="flex-1 font-['Plus_Jakarta_Sans'] text-[15px] font-semibold truncate">
                    {f.name}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full text-[12.5px] font-bold shrink-0"
                    style={{ backgroundColor: m.bg, color: m.fg }}
                  >
                    <m.Icon className="w-3.5 h-3.5" strokeWidth={2.5} /> {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Sticky action */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10"
        style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}
      >
        <button
          data-testid="button-lock"
          className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
        >
          <Lock className="w-[18px] h-[18px]" /> Lock it in
        </button>
        {!allHere && (
          <p className="text-center text-[12.5px] font-medium mt-3" style={{ color: MUTE }}>
            You can start now or wait for {waitingNames.length} more
          </p>
        )}
      </div>
    </div>
  );
}

function Ring({ value, total }: { value: number; total: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = total ? value / total : 0;
  const dash = c * pct;
  return (
    <div
      className="relative shrink-0"
      style={{ width: 84, height: 84 }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${value} of ${total} joined`}
    >
      <svg width="84" height="84" viewBox="0 0 84 84" className="-rotate-90" aria-hidden="true">
        <circle cx="42" cy="42" r={r} fill="none" stroke="#F3F1EC" strokeWidth="8" />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke={LINE}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold leading-none">{value}</span>
        <span className="text-[10px] font-semibold mt-0.5" style={{ color: MUTE }}>
          of {total}
        </span>
      </div>
    </div>
  );
}
