import { useState } from "react";
import { ArrowLeft, Share2, UtensilsCrossed } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

type Course = { id: string; order: string; name: string; options: string[] };

const COURSES: Course[] = [
  { id: "when", order: "I", name: "Timing", options: ["Today, 7:00 PM", "Tomorrow, lunch", "This weekend"] },
  { id: "where", order: "II", name: "Setting", options: ["Near BTS Asok", "At the mall", "Riverside"] },
  { id: "budget", order: "III", name: "Price", options: ["฿฿ Mid range", "฿ Cheap eats", "฿฿฿ Fine"] },
  { id: "diet", order: "IV", name: "Dietary", options: ["Vegetarian", "No restrictions", "Halal"] },
];

export default function TastingMenu() {
  const [picks, setPicks] = useState<Record<string, number>>({
    when: 0,
    where: 0,
    budget: 0,
    diet: 0,
  });

  const cycle = (id: string, len: number) =>
    setPicks((prev) => ({ ...prev, [id]: ((prev[id] ?? 0) + 1) % len }));

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
      </header>

      <main className="flex-1 px-6 pb-44 pt-2">
        {/* Menu card */}
        <div
          className="rounded-[24px] bg-white px-7 py-9"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 18px 44px -22px rgba(0,0,0,0.2)" }}
        >
          {/* Crest */}
          <div className="flex flex-col items-center text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: CREAM, border: `1.5px solid ${GOLD}` }}
            >
              <UtensilsCrossed className="w-6 h-6" style={{ color: INK }} />
            </div>
            <p className="text-[12px] font-semibold tracking-[0.32em] uppercase" style={{ color: MUTE }}>
              Toast Présente
            </p>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[27px] font-bold tracking-tight mt-1.5">
              Le Menu Dégustation
            </h1>
            <div className="flex items-center gap-3 mt-3 mb-1">
              <span className="h-px w-8" style={{ backgroundColor: "rgba(26,26,26,0.2)" }} />
              <span className="text-[12px] italic" style={{ color: MUTE }}>a four-course evening for four</span>
              <span className="h-px w-8" style={{ backgroundColor: "rgba(26,26,26,0.2)" }} />
            </div>
          </div>

          {/* Courses */}
          <div className="mt-7 space-y-6">
            {COURSES.map((c) => {
              const idx = picks[c.id] ?? 0;
              return (
                <button
                  key={c.id}
                  data-testid={`course-${c.id}`}
                  onClick={() => cycle(c.id, c.options.length)}
                  className="w-full text-left group active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold w-6 shrink-0"
                      style={{ color: GOLD }}
                    >
                      {c.order}
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold tracking-tight whitespace-nowrap">
                      {c.name}
                    </span>
                    <span
                      className="flex-1 mx-2 border-b border-dotted self-end mb-1"
                      style={{ borderColor: "rgba(26,26,26,0.2)" }}
                    />
                    <span className="text-[15px] font-medium text-right whitespace-nowrap">
                      {c.options[idx]}
                    </span>
                  </div>
                  <span
                    className="block text-[11.5px] italic mt-1 pl-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: MUTE }}
                  >
                    tap to change the course
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer flourish */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="h-px w-10" style={{ backgroundColor: "rgba(26,26,26,0.15)" }} />
            <span className="text-[13px]" style={{ color: GOLD }}>✦</span>
            <span className="h-px w-10" style={{ backgroundColor: "rgba(26,26,26,0.15)" }} />
          </div>
          <p className="text-center text-[12px] italic mt-3" style={{ color: MUTE }}>
            Bon appétit — served when everyone has voted
          </p>
        </div>
      </main>

      {/* Sticky actions */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10"
        style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}
      >
        <div className="flex flex-col gap-3">
          <button
            data-testid="button-invite"
            className="w-full h-14 text-white rounded-full font-semibold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: LINE, boxShadow: "0 8px 20px -8px rgba(6,199,85,0.5)" }}
          >
            <Share2 className="w-5 h-5" /> Send invitations
          </button>
          <button
            data-testid="button-start"
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center active:scale-[0.98] transition-transform"
            style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
          >
            Begin service
          </button>
        </div>
      </div>
    </div>
  );
}
