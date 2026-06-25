import React, { useState, useEffect, useMemo, useRef } from "react";
import { Navigation, Star, Clock, Crown, RotateCcw, MessageCircle, MapPin } from "lucide-react";

type Phase = "ready" | "measure" | "crown" | "payoff";

type Player = { name: string; cm: number; color: string };

const PLAYERS: Player[] = [
  { name: "Mali", cm: 14.6, color: "#FF6B6B" },
  { name: "You", cm: 11.2, color: "#FFCC02" },
  { name: "Beam", cm: 8.4, color: "#4ECDC4" },
  { name: "Nan", cm: 12.9, color: "#A78BFA" },
];

const WINNER = PLAYERS.reduce((b, p, i, a) => (p.cm > a[b].cm ? i : b), 0);
const MAX_CM = 16;
const TRACK_H = 430; // px available for the tallest fry
const STUB = 26;

const easeOut = (x: number) => 1 - Math.pow(1 - x, 2.2);

export function FryMeasureReveal() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [p, setP] = useState(0); // global measure progress 0..1
  const [cycle, setCycle] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    setPhase("ready");
    setP(0);
    const t = setTimeout(() => setPhase("measure"), 1500);
    return () => clearTimeout(t);
  }, [cycle]);

  useEffect(() => {
    if (phase !== "measure") return;
    const start = performance.now();
    const dur = 1700;
    let toCrown: ReturnType<typeof setTimeout> | undefined;
    const tick = (now: number) => {
      const x = Math.min(1, (now - start) / dur);
      setP(x);
      if (x < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        toCrown = setTimeout(() => setPhase("crown"), 220);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (toCrown) clearTimeout(toCrown);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "crown") return;
    const t = setTimeout(() => setPhase("payoff"), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "payoff") return;
    const t = setTimeout(() => setCycle((c) => c + 1), 6800);
    return () => clearTimeout(t);
  }, [phase]);

  const settled = phase === "crown" || phase === "payoff";
  const isPayoff = phase === "payoff";

  // per-fry staggered progress
  const fp = (i: number) => {
    const delay = i * 0.06;
    return easeOut(Math.max(0, Math.min(1, (p - delay) / (1 - 0.18))));
  };

  const confetti = useMemo(
    () =>
      Array.from({ length: 48 }).map((_, i) => {
        const colors = ["#FFCC02", "#FFE17D", "#FF8A3D", "#FFF4D6", "#FFFFFF", "#FFB300"];
        return {
          id: i,
          left: Math.random() * 100,
          x: (Math.random() - 0.5) * 150,
          delay: Math.random() * 0.5,
          dur: 1.9 + Math.random() * 1.4,
          size: 6 + Math.random() * 9,
          color: colors[i % colors.length],
          round: Math.random() > 0.55,
        };
      }),
    [cycle],
  );

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#070B16] py-4">
      <div
        key={cycle}
        className="relative mx-auto overflow-hidden select-none"
        style={{
          width: 390,
          height: 844,
          fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif",
        }}
      >
        {/* atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_-5%,#1C2A47_0%,#0C1325_52%,#070B16_100%)]" />
        {/* winner wash */}
        <div
          className="absolute left-1/2 top-[120px] h-[520px] w-[520px] -translate-x-1/2 rounded-full transition-all duration-700"
          style={{
            background:
              "radial-gradient(circle, rgba(255,204,2,0.26) 0%, rgba(255,204,2,0.08) 40%, rgba(255,204,2,0) 70%)",
            opacity: settled ? 1 : 0,
          }}
        />

        {/* ===== TOP BANNER ===== */}
        <div className="absolute left-0 right-0 top-0 z-30 px-6 pt-12 text-center">
          {!settled ? (
            <>
              <div
                className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-[#FFCC02]/40 bg-[#FFCC02]/10 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.16em] text-[#FFCC02]"
                style={{ animation: phase === "measure" ? "pulseSoft 0.6s ease-in-out infinite" : "none" }}
              >
                🍟 {phase === "measure" ? "MEASURING…" : "LONGEST FRY WINS"}
              </div>
              <h1 className="mt-4 text-[25px] font-extrabold leading-tight text-white">
                {phase === "measure" ? "Who pulled longest?" : "4 fries in the pot"}
              </h1>
              <p className="mt-1.5 text-[13px] font-medium text-slate-400">
                Lengths hidden till now — longest one decides
              </p>
            </>
          ) : (
            <div style={{ animation: "dropIn 0.5s cubic-bezier(.2,.9,.2,1.2) both" }}>
              <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-[#FFCC02] px-3 py-1 text-[11px] font-extrabold tracking-[0.18em] text-[#0B1325]">
                <Crown size={13} className="fill-[#0B1325]" />
                LONGEST PULL
              </div>
              <h2 className="mt-3 text-[26px] font-black leading-none text-white">
                {PLAYERS[WINNER].name}'s fry — <span className="text-[#FFCC02]">{PLAYERS[WINNER].cm} cm</span>
              </h2>
              <p className="mt-1.5 text-[13px] font-bold text-slate-300">
                {PLAYERS[WINNER].name === "You" ? "you pull the pick 🍟" : `${PLAYERS[WINNER].name} pulls the pick 🍟`}
              </p>
            </div>
          )}
        </div>

        {/* ===== MEASURE STAGE ===== */}
        <div className="absolute left-0 right-0 z-20" style={{ top: 232, height: TRACK_H + 96 }}>
          {/* ruler ticks */}
          {[0, 5, 10, 15].map((cm) => {
            const y = TRACK_H - (cm / MAX_CM) * TRACK_H;
            return (
              <div key={cm} className="absolute left-0 right-0" style={{ top: y }}>
                <div className="absolute left-3 right-3 border-t border-dashed border-white/8" />
                <span className="absolute left-3 -top-2 text-[10px] font-bold text-slate-500">{cm}cm</span>
              </div>
            );
          })}

          {/* spotlight beam onto winner */}
          {settled && (
            <div
              className="absolute z-10"
              style={{
                left: `${(WINNER + 0.5) * 25}%`,
                top: -60,
                width: 130,
                height: TRACK_H + 80,
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(180deg, rgba(255,204,2,0.42) 0%, rgba(255,204,2,0.14) 45%, rgba(255,204,2,0) 100%)",
                clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)",
                animation: "beamIn 0.5s ease-out both",
              }}
            />
          )}

          {/* fries row */}
          <div className="absolute inset-x-0 flex items-end justify-around px-3" style={{ height: TRACK_H, top: 0 }}>
            {PLAYERS.map((pl, i) => {
              const prog = fp(i);
              const h = STUB + (((pl.cm / MAX_CM) * TRACK_H) - STUB) * prog;
              const cmShown = (pl.cm * prog).toFixed(1);
              const isWin = i === WINNER;
              const dim = settled && !isWin;
              return (
                <div key={pl.name} className="relative flex h-full w-[22%] flex-col items-center justify-end">
                  {/* crown on winner */}
                  {settled && isWin && (
                    <div
                      className="absolute z-30"
                      style={{ bottom: h + 30, animation: "crownDrop 0.55s cubic-bezier(.2,.9,.2,1.4) both" }}
                    >
                      <Crown size={30} className="fill-[#FFCC02] text-[#FFCC02] drop-shadow-[0_3px_8px_rgba(0,0,0,0.5)]" />
                    </div>
                  )}
                  {/* cm tag riding the tip */}
                  <div
                    className="absolute z-20 rounded-md px-1.5 py-0.5 text-[11px] font-extrabold transition-colors"
                    style={{
                      bottom: h + 6,
                      background: isWin && settled ? "#FFCC02" : "rgba(255,255,255,0.10)",
                      color: isWin && settled ? "#0B1325" : "#E2E8F0",
                      opacity: dim ? 0.4 : 1,
                    }}
                  >
                    {cmShown}
                  </div>

                  {/* the fry */}
                  <div
                    className="relative w-[26px] rounded-t-[7px]"
                    style={{
                      height: h,
                      transition: settled ? "filter 0.4s ease, opacity 0.4s ease" : "none",
                      background: isWin
                        ? "linear-gradient(180deg,#FFE9A6 0%,#FFCC02 40%,#E8A200 100%)"
                        : "linear-gradient(180deg,#FFE2A0 0%,#F4C04A 45%,#C98F2E 100%)",
                      boxShadow: isWin && settled ? "0 0 22px rgba(255,204,2,0.7)" : "0 6px 14px rgba(0,0,0,0.35)",
                      filter: dim ? "grayscale(0.7) brightness(0.7)" : "none",
                      opacity: dim ? 0.6 : 1,
                    }}
                  >
                    {/* fry crinkle lines */}
                    <div className="absolute inset-x-[5px] top-1 bottom-1 rounded-full" style={{ background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.35) 0 2px, transparent 2px 9px)" }} />
                  </div>

                  {/* carton base + avatar */}
                  <div className="relative mt-1 flex w-full flex-col items-center">
                    <div
                      className="h-3 w-[34px] rounded-b-sm"
                      style={{ background: "linear-gradient(180deg,#E8533B,#C23B26)", opacity: dim ? 0.5 : 1 }}
                    />
                    <div
                      className="mt-1.5 grid h-7 w-7 place-items-center rounded-full text-[12px] font-black text-[#0B1325] ring-2 ring-[#070B16]"
                      style={{ background: pl.color, opacity: dim ? 0.5 : 1 }}
                    >
                      {pl.name === "You" ? "★" : pl.name[0]}
                    </div>
                    <span
                      className="mt-1 text-[11px] font-bold"
                      style={{ color: isWin && settled ? "#FFCC02" : "#94A3B8", opacity: dim ? 0.6 : 1 }}
                    >
                      {pl.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== CONFETTI ===== */}
        {settled && (
          <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
            {confetti.map((c) => (
              <span
                key={c.id}
                className="absolute top-0"
                style={
                  {
                    left: `${c.left}%`,
                    width: c.size,
                    height: c.round ? c.size : c.size * 0.5,
                    background: c.color,
                    borderRadius: c.round ? "50%" : 2,
                    ["--x" as any]: `${c.x}px`,
                    animation: `confettiFall ${c.dur}s linear ${c.delay}s infinite`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}

        {/* ===== PAYOFF CARD ===== */}
        <div
          className="absolute bottom-0 left-0 right-0 z-50 transition-all duration-700"
          style={{ transform: isPayoff ? "translateY(0)" : "translateY(110%)", opacity: isPayoff ? 1 : 0 }}
        >
          <div className="rounded-t-[28px] bg-white px-5 pb-7 pt-5 shadow-[0_-12px_40px_rgba(0,0,0,0.5)]">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />

            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[#FFF7DA] px-2.5 py-1 text-[11px] font-extrabold text-[#A77B00]">
              <Crown size={12} className="fill-[#A77B00]" /> {PLAYERS[WINNER].name}'s pick · where we're eating
            </div>
            <h3 className="text-[15px] font-bold text-slate-500">Head out together 🚗</h3>

            <div className="mt-3 flex gap-3">
              <div
                className="h-[78px] w-[78px] shrink-0 rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: "url('/__mockup/images/Winner-greencurry.png')" }}
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-[20px] font-extrabold leading-tight text-[#0B1325]">Krua Apsorn</h4>
                <div className="mt-1 flex items-center gap-2 text-[13px] text-slate-500">
                  <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                    <Star size={13} className="fill-[#FFCC02] text-[#FFCC02]" /> 4.8
                  </span>
                  <span>·</span>
                  <span>฿฿</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> 9 min
                  </span>
                </div>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#FFCC02]/20 px-2 py-0.5 text-[12px] font-extrabold text-[#A77B00]">
                  <MapPin size={11} /> 92% group match
                </span>
              </div>
            </div>

            <button className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#FFCC02] text-[17px] font-extrabold text-[#0B1325] shadow-[0_10px_28px_-6px_rgba(255,204,2,0.55)] transition-transform active:scale-[0.97]">
              <Navigation size={20} className="fill-[#0B1325]" />
              Get Directions
            </button>
            <button className="mt-2.5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#06C755] text-[15px] font-bold text-white transition-transform active:scale-[0.97]">
              <MessageCircle size={18} className="fill-white" />
              Share to LINE group
            </button>
          </div>
        </div>

        {/* replay */}
        {isPayoff && (
          <button
            onClick={() => setCycle((c) => c + 1)}
            className="absolute right-4 top-12 z-[60] inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm"
          >
            <RotateCcw size={12} /> Replay
          </button>
        )}

        <style>{`
          @keyframes confettiFall {
            0% { transform: translate(0,-30px) rotate(0deg); opacity: 0; }
            8% { opacity: 1; }
            100% { transform: translate(var(--x), 900px) rotate(720deg); opacity: 0.85; }
          }
          @keyframes crownDrop { 0% { transform: translateY(-22px) rotate(-12deg); opacity: 0; } 100% { transform: translateY(0) rotate(0deg); opacity: 1; } }
          @keyframes beamIn { 0% { opacity: 0; } 100% { opacity: 1; } }
          @keyframes dropIn { 0% { transform: translateY(-16px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
          @keyframes pulseSoft { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
        `}</style>
      </div>
    </div>
  );
}
