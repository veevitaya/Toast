import { useState } from "react";
import { ArrowLeft, Share2, Utensils, Clock, MapPin, Check, HelpCircle, X } from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

type Status = "going" | "maybe" | "out";
type Guest = { id: string; name: string; initial: string; status: Status };

const ORDER: Status[] = ["going", "maybe", "out"];
const META: Record<Status, { label: string; color: string; tint: string; Icon: typeof Check }> = {
  going: { label: "Going", color: LINE, tint: "rgba(6,199,85,0.12)", Icon: Check },
  maybe: { label: "Maybe", color: "#C79200", tint: "rgba(255,204,2,0.2)", Icon: HelpCircle },
  out: { label: "Can't", color: MUTE, tint: "rgba(154,147,138,0.16)", Icon: X },
};

const WHEN = ["Today, 7:00 PM", "Tonight, 8:30 PM", "Tomorrow, lunch", "This weekend"];
const WHERE = ["Near BTS Asok", "Thonglor", "Riverside", "At the mall"];

export default function TableReservation() {
  const [guests, setGuests] = useState<Guest[]>([
    { id: "a", name: "You", initial: "Y", status: "going" },
    { id: "b", name: "Mint", initial: "M", status: "going" },
    { id: "c", name: "Ploy", initial: "P", status: "going" },
    { id: "d", name: "Bank", initial: "B", status: "maybe" },
  ]);
  const [whenIdx, setWhenIdx] = useState(0);
  const [whereIdx, setWhereIdx] = useState(0);

  const cycleGuest = (id: string) =>
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: ORDER[(ORDER.indexOf(g.status) + 1) % ORDER.length] } : g))
    );

  const going = guests.filter((g) => g.status === "going").length;
  const maybe = guests.filter((g) => g.status === "maybe").length;

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
          You're invited
        </span>
      </header>

      <main className="flex-1 px-6 pb-44 pt-3">
        <div className="mb-5">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight leading-tight">Your table's set</h1>
          <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
            Tap the details to set them, then tap a name to RSVP.
          </p>
        </div>

        {/* Reservation card */}
        <div
          className="relative rounded-[24px] bg-white p-6 overflow-hidden"
          style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.18)", border: "1px solid rgba(0,0,0,0.05)" }}
        >
          {/* corner ribbon */}
          <div
            className="absolute -right-10 top-5 rotate-45 px-12 py-1 text-[10px] font-bold tracking-[0.2em] text-center"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            RESERVED
          </div>

          {/* Party */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: CREAM, border: `1.5px solid ${GOLD}` }}>
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <p className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold leading-tight">Table for {going}</p>
              <p className="text-[13px] mt-0.5" style={{ color: MUTE }}>
                {going} confirmed{maybe > 0 ? ` · ${maybe} maybe` : ""}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="mt-5 space-y-1">
            <button
              data-testid="button-when"
              onClick={() => setWhenIdx((i) => (i + 1) % WHEN.length)}
              className="w-full flex items-center gap-3 py-2.5 text-left active:scale-[0.99] transition-transform"
            >
              <Clock className="w-4.5 h-4.5 shrink-0" style={{ color: MUTE }} />
              <span className="flex-1">
                <span className="block text-[11px] uppercase tracking-wider font-semibold" style={{ color: MUTE }}>When</span>
                <span className="block font-['Plus_Jakarta_Sans'] text-[15px] font-semibold">{WHEN[whenIdx]}</span>
              </span>
            </button>
            <div className="h-px" style={{ backgroundColor: "rgba(26,26,26,0.06)" }} />
            <button
              data-testid="button-where"
              onClick={() => setWhereIdx((i) => (i + 1) % WHERE.length)}
              className="w-full flex items-center gap-3 py-2.5 text-left active:scale-[0.99] transition-transform"
            >
              <MapPin className="w-4.5 h-4.5 shrink-0" style={{ color: MUTE }} />
              <span className="flex-1">
                <span className="block text-[11px] uppercase tracking-wider font-semibold" style={{ color: MUTE }}>Where</span>
                <span className="block font-['Plus_Jakarta_Sans'] text-[15px] font-semibold">{WHERE[whereIdx]}</span>
              </span>
            </button>
          </div>

          {/* Perforation */}
          <div className="relative my-4">
            <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full" style={{ backgroundColor: CREAM }} />
            <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full" style={{ backgroundColor: CREAM }} />
            <div className="border-t border-dashed" style={{ borderColor: "rgba(26,26,26,0.18)" }} />
          </div>

          {/* Guests */}
          <p className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: MUTE }}>Who's coming</p>
          <div className="space-y-1.5">
            {guests.map((g) => {
              const m = META[g.status];
              return (
                <button
                  key={g.id}
                  data-testid={`guest-${g.id}`}
                  onClick={() => cycleGuest(g.id)}
                  aria-label={`${g.name} is ${m.label}, tap to change`}
                  className="w-full flex items-center gap-3 py-1.5 active:scale-[0.99] transition-transform"
                >
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[14px] font-bold shrink-0"
                    style={{ backgroundColor: "#F3F1EC", color: INK }}
                  >
                    {g.initial}
                  </span>
                  <span className="flex-1 text-left font-['Plus_Jakarta_Sans'] text-[15px] font-semibold">{g.name}</span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold"
                    style={{ backgroundColor: m.tint, color: m.color }}
                  >
                    <m.Icon className="w-3 h-3" strokeWidth={3} /> {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-center text-[13px] mt-5" style={{ color: MUTE }}>
          {going} seats locked · save the rest a chair
        </p>
      </main>

      {/* Sticky actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10" style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}>
        <div className="flex flex-col gap-3">
          <button
            data-testid="button-invite"
            className="w-full h-14 text-white rounded-full font-semibold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: LINE, boxShadow: "0 8px 20px -8px rgba(6,199,85,0.5)" }}
          >
            <Share2 className="w-5 h-5" /> Invite via LINE
          </button>
          <button
            data-testid="button-confirm"
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center active:scale-[0.98] transition-transform"
            style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
          >
            Confirm the table
          </button>
        </div>
      </div>
    </div>
  );
}
