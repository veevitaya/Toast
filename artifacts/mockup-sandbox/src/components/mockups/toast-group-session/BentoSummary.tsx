import { useState } from "react";
import { ArrowLeft, Share2, Play } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

type Cell = { id: string; emoji: string; label: string; value: string; span?: boolean };

const CELLS: Cell[] = [
  { id: "when", emoji: "🕖", label: "When", value: "Today · 7PM" },
  { id: "where", emoji: "📍", label: "Where", value: "Near BTS" },
  { id: "budget", emoji: "💸", label: "Budget", value: "฿฿ Mid" },
  { id: "who", emoji: "👯", label: "Who", value: "4 friends" },
];

const VIBES = [
  { id: "spicy", label: "🌶️ Spicy" },
  { id: "comfort", label: "🍜 Comfort" },
  { id: "healthy", label: "🥗 Healthy" },
  { id: "treat", label: "✨ Treat" },
];

export default function BentoSummary() {
  const [selected, setSelected] = useState<string | null>("when");
  const [vibe, setVibe] = useState("comfort");

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter']"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <header className="flex items-center justify-between px-6 pt-14 pb-2">
        <button
          aria-label="Go back"
          data-testid="button-back"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span
          className="text-[12px] font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: "rgba(6,199,85,0.12)", color: "#079f46" }}
        >
          Freshly packed
        </span>
      </header>

      <main className="flex-1 px-6 pb-44 pt-3">
        <div className="mb-5">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight leading-tight">
            Your session bento 🍱
          </h1>
          <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
            Each compartment holds a piece of the plan. Tap to tweak before sharing.
          </p>
        </div>

        {/* Bento tray */}
        <div
          className="rounded-[26px] p-3"
          style={{
            backgroundColor: "#EFE9DD",
            border: "1px solid rgba(26,26,26,0.06)",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            {CELLS.map((c) => {
              const on = selected === c.id;
              return (
                <button
                  key={c.id}
                  data-testid={`cell-${c.id}`}
                  onClick={() => setSelected(c.id)}
                  className="rounded-[18px] bg-white p-4 text-left transition-all active:scale-[0.97] flex flex-col gap-2 aspect-square justify-between"
                  style={{
                    border: on ? `2px solid ${GOLD}` : "1px solid rgba(0,0,0,0.05)",
                    boxShadow: on
                      ? "0 12px 26px -12px rgba(255,204,2,0.55)"
                      : "0 6px 16px -10px rgba(0,0,0,0.08)",
                  }}
                >
                  <span
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-[24px]"
                    style={{ backgroundColor: CREAM }}
                  >
                    {c.emoji}
                  </span>
                  <span>
                    <span className="block text-[12px] font-semibold uppercase tracking-wider" style={{ color: MUTE }}>
                      {c.label}
                    </span>
                    <span className="block font-['Plus_Jakarta_Sans'] text-[17px] font-bold leading-tight mt-0.5">
                      {c.value}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Wide vibe compartment */}
          <div
            className="mt-3 rounded-[18px] bg-white p-4"
            style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 6px 16px -10px rgba(0,0,0,0.08)" }}
          >
            <span className="block text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: MUTE }}>
              Tonight's flavor
            </span>
            <div className="flex flex-wrap gap-2">
              {VIBES.map((v) => {
                const on = vibe === v.id;
                return (
                  <button
                    key={v.id}
                    data-testid={`vibe-${v.id}`}
                    onClick={() => setVibe(v.id)}
                    className="px-3.5 py-2 rounded-full text-[13.5px] font-semibold transition-all active:scale-95"
                    style={{
                      backgroundColor: on ? INK : "#F3F1EC",
                      color: on ? "#fff" : INK,
                    }}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-center text-[13px] mt-5" style={{ color: MUTE }}>
          4 compartments filled · ready to share
        </p>
      </main>

      {/* Sticky actions */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10"
        style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}
      >
        <div className="flex gap-3">
          <button
            data-testid="button-invite"
            className="flex-1 h-14 text-white rounded-full font-semibold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: LINE, boxShadow: "0 8px 20px -8px rgba(6,199,85,0.5)" }}
          >
            <Share2 className="w-5 h-5" /> Invite
          </button>
          <button
            data-testid="button-start"
            className="flex-[1.4] h-14 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
          >
            <Play className="w-5 h-5" fill={INK} /> Serve it up
          </button>
        </div>
      </div>
    </div>
  );
}
