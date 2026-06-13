import { useState } from "react";
import { ArrowLeft, Send, Stamp, Clock, MapPin, Users, Heart, Soup, Fish, Pizza, Salad, IceCream } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

const CUISINES = [
  { Icon: Soup, label: "Noodles" },
  { Icon: Fish, label: "Sushi" },
  { Icon: Pizza, label: "Pizza" },
  { Icon: Salad, label: "Salads" },
  { Icon: IceCream, label: "Dessert" },
];
const WHEN = ["Today, 7:00 PM", "Tonight, 8:30 PM", "Tomorrow, lunch", "This weekend"];
const WHERE = ["Near BTS Asok", "Thonglor", "Riverside", "At the mall"];

export default function DinnerPostcard() {
  const [cuisine, setCuisine] = useState(0);
  const [whenIdx, setWhenIdx] = useState(0);
  const [whereIdx, setWhereIdx] = useState(0);
  const [coming, setComing] = useState(true);
  const c = CUISINES[cuisine];

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
          A little invite
        </span>
      </header>

      <main className="flex-1 px-6 pb-44 pt-3">
        <div className="mb-5">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight leading-tight">Come eat with us</h1>
          <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
            A postcard for the crew — tap the stamp or any line to set the plan.
          </p>
        </div>

        {/* Postcard */}
        <div
          className="relative rounded-[20px] bg-white p-5 overflow-hidden rotate-[-1.2deg]"
          style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.2)", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          {/* Top row: greeting + stamp */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: MUTE }}>Postcard</p>
              <p className="font-['Plus_Jakarta_Sans'] text-[19px] font-bold leading-tight mt-1">Greetings from<br />dinner</p>
            </div>
            {/* Stamp */}
            <button
              data-testid="button-stamp"
              onClick={() => setCuisine((i) => (i + 1) % CUISINES.length)}
              aria-label={`Cuisine: ${c.label}, tap to change`}
              className="shrink-0 w-[68px] flex flex-col items-center active:scale-95 transition-transform"
            >
              <span
                className="w-full h-[76px] rounded-[6px] flex flex-col items-center justify-center gap-0.5"
                style={{ backgroundColor: CREAM, border: "2px dashed rgba(26,26,26,0.25)" }}
              >
                <c.Icon className="w-7 h-7" strokeWidth={1.75} style={{ color: INK }} />
                <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: MUTE }}>{c.label}</span>
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: MUTE }}>
                <Stamp className="w-3 h-3" /> tap
              </span>
            </button>
          </div>

          {/* Handwritten note */}
          <p className="italic text-[15.5px] leading-relaxed mt-4" style={{ color: "rgba(26,26,26,0.82)" }}>
            "Hey! We finally picked a night to grab {c.label.toLowerCase()} together — pull up a chair and join us. Save room!"
          </p>

          {/* Divider */}
          <div className="border-t border-dashed my-4" style={{ borderColor: "rgba(26,26,26,0.18)" }} />

          {/* Address block */}
          <div className="grid grid-cols-[18px_1fr] gap-x-3 gap-y-3 items-center">
            <Clock className="w-4 h-4" style={{ color: GOLD }} />
            <button
              data-testid="button-when"
              onClick={() => setWhenIdx((i) => (i + 1) % WHEN.length)}
              className="text-left active:opacity-70 transition-opacity"
            >
              <span className="block text-[10px] uppercase tracking-wider font-semibold" style={{ color: MUTE }}>When</span>
              <span className="block font-['Plus_Jakarta_Sans'] text-[15px] font-semibold">{WHEN[whenIdx]}</span>
            </button>

            <MapPin className="w-4 h-4" style={{ color: GOLD }} />
            <button
              data-testid="button-where"
              onClick={() => setWhereIdx((i) => (i + 1) % WHERE.length)}
              className="text-left active:opacity-70 transition-opacity"
            >
              <span className="block text-[10px] uppercase tracking-wider font-semibold" style={{ color: MUTE }}>Where</span>
              <span className="block font-['Plus_Jakarta_Sans'] text-[15px] font-semibold">{WHERE[whereIdx]}</span>
            </button>

            <Users className="w-4 h-4" style={{ color: GOLD }} />
            <div>
              <span className="block text-[10px] uppercase tracking-wider font-semibold" style={{ color: MUTE }}>To</span>
              <span className="block font-['Plus_Jakarta_Sans'] text-[15px] font-semibold">The dinner crew · 4</span>
            </div>
          </div>
        </div>

        {/* RSVP toggle */}
        <button
          data-testid="button-coming"
          onClick={() => setComing((v) => !v)}
          aria-pressed={coming}
          className="mt-6 w-full h-12 rounded-full font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
          style={
            coming
              ? { backgroundColor: "rgba(6,199,85,0.12)", color: LINE }
              : { backgroundColor: "#F3F1EC", color: MUTE }
          }
        >
          <Heart className="w-4 h-4" fill={coming ? LINE : "none"} /> {coming ? "You're in!" : "Count me in"}
        </button>
      </main>

      {/* Sticky actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10" style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}>
        <div className="flex flex-col gap-3">
          <button
            data-testid="button-send"
            className="w-full h-14 text-white rounded-full font-semibold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: LINE, boxShadow: "0 8px 20px -8px rgba(6,199,85,0.5)" }}
          >
            <Send className="w-5 h-5" /> Send via LINE
          </button>
          <button
            data-testid="button-save"
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center active:scale-[0.98] transition-transform"
            style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
          >
            Save the plan
          </button>
        </div>
      </div>
    </div>
  );
}
