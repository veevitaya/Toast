import { useState } from "react";
import { ArrowLeft, Share2, Clock, MapPin, Check, HelpCircle, X, Lock, UtensilsCrossed } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

type Status = "going" | "maybe" | "out";
type Friend = { id: string; name: string; initial: string; status: Status };

const STATUSES: { key: Status; label: string; color: string; Icon: typeof Check }[] = [
  { key: "going", label: "Going", color: LINE, Icon: Check },
  { key: "maybe", label: "Maybe", color: "#C79200", Icon: HelpCircle },
  { key: "out", label: "Can't", color: MUTE, Icon: X },
];

const WHEN = ["7:00 PM", "8:30 PM", "Lunch tomorrow", "This weekend"];
const WHERE = ["Near BTS Asok", "Thonglor", "Riverside", "At the mall"];

export default function GroupInvite() {
  const [friends, setFriends] = useState<Friend[]>([
    { id: "a", name: "You", initial: "Y", status: "going" },
    { id: "b", name: "Mint", initial: "M", status: "going" },
    { id: "c", name: "Ploy", initial: "P", status: "maybe" },
    { id: "d", name: "Bank", initial: "B", status: "going" },
    { id: "e", name: "Nut", initial: "N", status: "out" },
  ]);
  const [whenIdx, setWhenIdx] = useState(0);
  const [whereIdx, setWhereIdx] = useState(0);

  const setStatus = (id: string, status: Status) =>
    setFriends((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));

  const counts = {
    going: friends.filter((f) => f.status === "going").length,
    maybe: friends.filter((f) => f.status === "maybe").length,
    out: friends.filter((f) => f.status === "out").length,
  };
  const total = friends.length;

  return (
    <div className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter']" style={{ backgroundColor: CREAM, color: INK }}>
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
          Group invite
        </span>
      </header>

      <main className="flex-1 px-6 pb-44 pt-3">
        <div className="mb-5">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight leading-tight">Who's in?</h1>
          <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
            Drop it in the group chat and watch the RSVPs roll in.
          </p>
        </div>

        {/* Chat invite bubble */}
        <div className="flex items-start gap-2.5 mb-5">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[14px] font-bold shrink-0"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            T
          </span>
          <div>
            <div
              className="rounded-[18px] rounded-tl-[4px] bg-white px-4 py-3"
              style={{ boxShadow: "0 8px 20px -14px rgba(0,0,0,0.25)", border: "1px solid rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                <span className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold">Dinner together tonight?</span>
              </div>
              <p className="text-[14px] leading-relaxed mt-1" style={{ color: "rgba(26,26,26,0.65)" }}>Let's meet up — RSVP below.</p>
              <div className="flex flex-wrap gap-2 mt-3">
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
            </div>
            <p className="text-[11px] mt-1 ml-1" style={{ color: MUTE }}>Toast · just now</p>
          </div>
        </div>

        {/* RSVP list */}
        <div
          className="rounded-[24px] bg-white p-5"
          style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: MUTE }}>The crew</p>
            <p className="text-[13px] font-semibold" style={{ color: LINE }}>{counts.going} going</p>
          </div>

          <div className="space-y-2.5">
            {friends.map((f) => (
              <div key={f.id} className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[14px] font-bold shrink-0"
                  style={{ backgroundColor: "#F3F1EC", color: INK }}
                >
                  {f.initial}
                </span>
                <span className="flex-1 font-['Plus_Jakarta_Sans'] text-[15px] font-semibold truncate">{f.name}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {STATUSES.map((s) => {
                    const active = f.status === s.key;
                    return (
                      <button
                        key={s.key}
                        data-testid={`rsvp-${f.id}-${s.key}`}
                        onClick={() => setStatus(f.id, s.key)}
                        aria-label={`Mark ${f.name} as ${s.label}`}
                        aria-pressed={active}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
                        style={
                          active
                            ? { backgroundColor: s.color, color: s.key === "maybe" ? INK : "#fff" }
                            : { backgroundColor: "#F3F1EC", color: MUTE }
                        }
                      >
                        <s.Icon className="w-4 h-4" strokeWidth={active ? 3 : 2.25} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Tally bar */}
          <div className="mt-5">
            <div className="flex h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F3F1EC" }}>
              {counts.going > 0 && <div style={{ width: `${(counts.going / total) * 100}%`, backgroundColor: LINE }} />}
              {counts.maybe > 0 && <div style={{ width: `${(counts.maybe / total) * 100}%`, backgroundColor: GOLD }} />}
              {counts.out > 0 && <div style={{ width: `${(counts.out / total) * 100}%`, backgroundColor: "rgba(154,147,138,0.5)" }} />}
            </div>
            <div className="flex items-center gap-4 mt-2.5 text-[12px] font-medium" style={{ color: MUTE }}>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: LINE }} /> {counts.going} going</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: GOLD }} /> {counts.maybe} maybe</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(154,147,138,0.5)" }} /> {counts.out} out</span>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10" style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}>
        <div className="flex flex-col gap-3">
          <button
            data-testid="button-share"
            className="w-full h-14 text-white rounded-full font-semibold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: LINE, boxShadow: "0 8px 20px -8px rgba(6,199,85,0.5)" }}
          >
            <Share2 className="w-5 h-5" /> Share to LINE group
          </button>
          <button
            data-testid="button-lock"
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
          >
            <Lock className="w-4.5 h-4.5" /> Lock it in
          </button>
        </div>
      </div>
    </div>
  );
}
