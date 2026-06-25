/* Toast — group tie-breaker "Longest Fry" winner reveal (cinematic mockup) */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Navigation, Star, Crown, RotateCcw, MessageCircle, MapPin, Lock } from "lucide-react";

type Phase = "ready" | "race" | "crown" | "where" | "lifting" | "reveal" | "payoff";

type Player = { name: string; cm: number; color: string };

const PLAYERS: Player[] = [
  { name: "Mali", cm: 14.6, color: "#FF6B6B" },
  { name: "You", cm: 11.2, color: "#FFCC02" },
  { name: "Beam", cm: 8.4, color: "#4ECDC4" },
  { name: "Nan", cm: 12.9, color: "#A78BFA" },
];

const WINNER = PLAYERS.reduce((b, p, i, a) => (p.cm > a[b].cm ? i : b), 0);
const MAX_FRY = Math.max(...PLAYERS.map((p) => p.cm)); // longest true length
const SECOND = [...PLAYERS.map((p) => p.cm)].sort((a, b) => b - a)[1]; // runner-up length
const RULER_MAX = 16; // cm at top of the ruler
const TRACK_H = 470; // px the ruler spans
const STUB = 16;

function DestinationScreen({
  show,
  image,
  pickLabel,
  name,
  rating,
  price,
  eta,
  match,
  onReplay,
}: {
  show: boolean;
  image: string;
  pickLabel: string;
  name: string;
  rating: string;
  price: string;
  eta: string;
  match: string;
  onReplay: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-[60] flex flex-col bg-white"
      style={{
        transition: "opacity 0.5s ease, transform 0.55s cubic-bezier(.2,.9,.2,1.05)",
        opacity: show ? 1 : 0,
        transform: show ? "translateX(0) scale(1)" : "translateX(28px) scale(0.97)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ height: 430 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')`, animation: show ? "kenburns 7s ease-out both" : "none" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,11,22,0.5) 0%, rgba(7,11,22,0) 26%, rgba(7,11,22,0.1) 55%, rgba(255,255,255,0) 80%, #fff 100%)",
          }}
        />
        <div className="absolute left-5 top-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFCC02] px-3 py-1.5 text-[11px] font-extrabold tracking-[0.12em] text-[#0B1325] shadow-[0_6px_18px_rgba(0,0,0,0.3)]">
            <Crown size={13} className="fill-[#0B1325]" /> {pickLabel}
          </div>
        </div>
        <div className="absolute bottom-8 left-5 right-5">
          <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.22em] text-[#FFCC02]">Tonight's table</p>
          <h2 className="text-[31px] font-black leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">
            {name}
          </h2>
          <div className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-white/90">
            <span className="inline-flex items-center gap-1">
              <Star size={13} className="fill-[#FFCC02] text-[#FFCC02]" /> {rating}
            </span>
            <span className="opacity-60">·</span>
            <span>{price}</span>
            <span className="opacity-60">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} className="text-[#FFCC02]" /> {eta}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-6 flex flex-1 flex-col rounded-t-[28px] bg-white px-6 pb-7 pt-5">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFCC02]/20 px-2.5 py-1 text-[12px] font-extrabold text-[#A77B00]">
            {match} group match
          </span>
          <span className="text-[12px] font-semibold text-slate-400">Open till 10pm</span>
        </div>
        <p className="mt-3 text-[16px] font-bold leading-snug text-slate-600">
          {pickLabel} pulled the longest fry — so the table's headed here 🍽️
        </p>

        <div className="mt-auto pt-5">
          <button className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#FFCC02] text-[17px] font-extrabold text-[#0B1325] shadow-[0_10px_28px_-6px_rgba(255,204,2,0.55)] transition-transform active:scale-[0.97]">
            <Navigation size={20} className="fill-[#0B1325]" />
            Get Directions
          </button>
          <button className="mt-2.5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#06C755] text-[15px] font-bold text-white transition-transform active:scale-[0.97]">
            <MessageCircle size={18} className="fill-white" />
            Share to LINE group
          </button>
        </div>
      </div>

      {show && (
        <button
          onClick={onReplay}
          className="absolute right-4 top-12 z-[70] inline-flex items-center gap-1 rounded-full bg-black/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm"
        >
          <RotateCcw size={12} /> Replay
        </button>
      )}

      <style>{`@keyframes kenburns { 0% { transform: scale(1.14); } 100% { transform: scale(1); } }`}</style>
    </div>
  );
}

export function FryMeasureReveal() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [lvl, setLvl] = useState(0); // current measured length (cm), shared by all fries
  const [cycle, setCycle] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    setPhase("ready");
    setLvl(0);
    const t = setTimeout(() => setPhase("race"), 1500);
    return () => clearTimeout(t);
  }, [cycle]);

  // the race: one rising tape measure; every fry climbs at the SAME rate and
  // freezes at its own length, so the longest is the last one still climbing.
  useEffect(() => {
    if (phase !== "race") return;
    const start = performance.now();
    const dur = 2600;
    let toCrown: ReturnType<typeof setTimeout> | undefined;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      // ease out gently so the final solo climb lingers for suspense
      const eased = 1 - Math.pow(1 - t, 1.7);
      setLvl(eased * MAX_FRY);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        toCrown = setTimeout(() => setPhase("crown"), 260);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (toCrown) clearTimeout(toCrown);
    };
  }, [phase]);

  // once the longest fry is crowned, hand off to the destination reveal:
  // crown → "now… where to?" → lid lifts → restaurant medallion → full screen
  useEffect(() => {
    const next: Partial<Record<Phase, [Phase, number]>> = {
      crown: ["where", 1500],
      where: ["lifting", 1100],
      lifting: ["reveal", 850],
      reveal: ["payoff", 1300],
      payoff: ["__cycle" as Phase, 7200],
    };
    const step = next[phase];
    if (!step) return;
    const [to, ms] = step;
    const t = setTimeout(() => {
      if (to === ("__cycle" as Phase)) setCycle((c) => c + 1);
      else setPhase(to);
    }, ms);
    return () => clearTimeout(t);
  }, [phase]);

  // fry-race stage states
  const isFryStage = phase === "ready" || phase === "race" || phase === "crown";
  const fryCrowned = phase === "crown";
  const soloClimb = phase === "race" && lvl > SECOND;
  // destination-reveal stage states (mirrors the duel reveal)
  const destActive = phase === "where" || phase === "lifting" || phase === "reveal" || phase === "payoff";
  const lidGone = phase === "lifting" || phase === "reveal" || phase === "payoff";
  const isReveal = phase === "reveal" || phase === "payoff";
  const isPayoff = phase === "payoff";

  const winnerName = PLAYERS[WINNER].name;
  const pickPossessive = winnerName === "You" ? "YOUR PICK" : `${winnerName}'S PICK`;

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
            opacity: fryCrowned || soloClimb || isReveal ? 1 : 0,
          }}
        />

        {/* ===== TOP BANNER ===== */}
        <div className="absolute left-0 right-0 top-0 z-30 px-6 pt-12 text-center">
          {isFryStage ? (
            !fryCrowned ? (
              <>
                <div
                  className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-[#FFCC02]/40 bg-[#FFCC02]/10 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.16em] text-[#FFCC02]"
                  style={{ animation: phase === "race" ? "pulseSoft 0.6s ease-in-out infinite" : "none" }}
                >
                  🍟 {phase === "race" ? "MEASURING…" : "LONGEST FRY WINS"}
                </div>
                <h1 className="mt-4 text-[25px] font-extrabold leading-tight text-white">
                  {phase === "ready" ? "4 fries in the pot" : soloClimb ? "…and it keeps going!" : "They're climbing!"}
                </h1>
                <p className="mt-1.5 text-[13px] font-medium text-slate-400">
                  {soloClimb ? "Last fry still rising takes it" : "Each freezes at its length — longest one wins"}
                </p>
              </>
            ) : (
              <div style={{ animation: "dropIn 0.5s cubic-bezier(.2,.9,.2,1.2) both" }}>
                <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-[#FFCC02] px-3 py-1 text-[11px] font-extrabold tracking-[0.18em] text-[#0B1325]">
                  <Crown size={13} className="fill-[#0B1325]" />
                  LONGEST PULL
                </div>
                <h2 className="mt-3 text-[26px] font-black leading-none text-white">
                  {winnerName}'s fry — <span className="text-[#FFCC02]">{PLAYERS[WINNER].cm} cm</span>
                </h2>
                <p className="mt-1.5 text-[13px] font-bold text-slate-300">
                  {winnerName === "You" ? "you pull the pick 🍟" : `${winnerName} pulls the pick 🍟`}
                </p>
              </div>
            )
          ) : !isReveal ? (
            <>
              <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-[#FFCC02] px-3 py-1 text-[11px] font-extrabold tracking-[0.18em] text-[#0B1325]">
                <Crown size={13} className="fill-[#0B1325]" /> {pickPossessive}
              </div>
              <h1 className="mt-3 text-[26px] font-extrabold leading-tight text-white">
                {phase === "lifting" ? "Lifting the lid…" : "Now… where to?"}
              </h1>
              <p className="mt-1.5 text-[13px] font-medium text-slate-400">
                The longest fry sets the table — under wraps for a sec
              </p>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 rounded-full bg-[#FFCC02]"
                    style={{ animation: `drumDot 1s ease-in-out ${d * 0.18}s infinite` }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div style={{ animation: "dropIn 0.5s cubic-bezier(.2,.9,.2,1.2) both" }}>
              <h1 className="mt-4 text-[15px] font-bold uppercase tracking-[0.26em] text-[#FFCC02]">The pick is in</h1>
            </div>
          )}
        </div>

        {/* ===== MEASURE STAGE (fades out as we hand off to the destination) ===== */}
        <div
          className="absolute left-0 right-0 z-20"
          style={{
            top: 232,
            height: TRACK_H + 96,
            opacity: destActive ? 0 : 1,
            transition: "opacity 0.5s ease",
            pointerEvents: destActive ? "none" : "auto",
          }}
        >
          {/* ruler ticks */}
          {[0, 5, 10, 15].map((cm) => {
            const y = TRACK_H - (cm / RULER_MAX) * TRACK_H;
            return (
              <div key={cm} className="absolute left-0 right-0" style={{ top: y }}>
                <div className="absolute left-3 right-3 border-t border-dashed border-white/8" />
                <span className="absolute left-3 -top-2 text-[10px] font-bold text-slate-500">{cm}cm</span>
              </div>
            );
          })}

          {/* spotlight beam onto winner */}
          {(fryCrowned || soloClimb) && (
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
              const measured = Math.min(lvl, pl.cm);
              const h = Math.max(STUB, (measured / RULER_MAX) * TRACK_H);
              const cmShown = measured.toFixed(1);
              const isWin = i === WINNER;
              const locked = lvl >= pl.cm - 0.02; // this fry has reached its length
              const dropped = locked && !isWin; // out of the race
              const dim = (fryCrowned && !isWin) || (dropped && phase === "race");
              const climbing = !locked || (isWin && !fryCrowned);
              return (
                <div key={pl.name} className="relative flex h-full w-[22%] flex-col items-center justify-end">
                  {/* crown on winner */}
                  {fryCrowned && isWin && (
                    <div
                      className="absolute z-30"
                      style={{ bottom: h + 30, animation: "crownDrop 0.55s cubic-bezier(.2,.9,.2,1.4) both" }}
                    >
                      <Crown size={30} className="fill-[#FFCC02] text-[#FFCC02] drop-shadow-[0_3px_8px_rgba(0,0,0,0.5)]" />
                    </div>
                  )}
                  {/* cm tag riding the tip */}
                  <div
                    className="absolute z-20 inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-extrabold transition-colors"
                    style={{
                      bottom: h + 6,
                      background: isWin && fryCrowned ? "#FFCC02" : dropped ? "rgba(148,163,184,0.18)" : "rgba(255,255,255,0.12)",
                      color: isWin && fryCrowned ? "#0B1325" : dropped ? "#94A3B8" : "#E2E8F0",
                      opacity: dim ? 0.5 : 1,
                    }}
                  >
                    {dropped && phase === "race" && <Lock size={9} />}
                    {cmShown}
                  </div>

                  {/* the fry */}
                  <div
                    className="relative w-[26px] rounded-t-[7px]"
                    style={{
                      height: h,
                      background: isWin
                        ? "linear-gradient(180deg,#FFE9A6 0%,#FFCC02 40%,#E8A200 100%)"
                        : "linear-gradient(180deg,#FFE2A0 0%,#F4C04A 45%,#C98F2E 100%)",
                      boxShadow:
                        (isWin && fryCrowned) || (isWin && soloClimb)
                          ? "0 0 24px rgba(255,204,2,0.75)"
                          : "0 6px 14px rgba(0,0,0,0.35)",
                      filter: dim ? "grayscale(0.7) brightness(0.7)" : "none",
                      opacity: dim ? 0.55 : 1,
                      transition: "filter 0.35s ease, opacity 0.35s ease, box-shadow 0.3s ease",
                      animation: isWin && soloClimb ? "winnerThrob 0.7s ease-in-out infinite" : "none",
                    }}
                  >
                    {/* fry crinkle lines */}
                    <div
                      className="absolute inset-x-[5px] top-1 bottom-1 rounded-full"
                      style={{ background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.35) 0 2px, transparent 2px 9px)" }}
                    />
                    {/* rising spark at the tip while climbing */}
                    {climbing && phase === "race" && (
                      <div
                        className="absolute -top-0.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white"
                        style={{ filter: "blur(1px)", animation: "tipSpark 0.5s ease-in-out infinite" }}
                      />
                    )}
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
                      style={{ color: isWin && fryCrowned ? "#FFCC02" : "#94A3B8", opacity: dim ? 0.6 : 1 }}
                    >
                      {pl.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== DESTINATION STAGE: cloche lifts to reveal the restaurant ===== */}
        <div
          className="absolute inset-0 z-20"
          style={{
            opacity: destActive ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: destActive ? "auto" : "none",
          }}
        >
          {/* burst light behind medallion */}
          {isReveal && (
            <div
              className="absolute left-1/2 top-[358px] z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,204,2,0.30) 35%, rgba(255,204,2,0) 68%)",
                animation: "burst 0.7s ease-out both",
              }}
            />
          )}
          {isReveal && (
            <div
              className="absolute left-[195px] top-[330px] z-10 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#FFCC02]"
              style={{ animation: "ringPing 1.1s ease-out 1" }}
            />
          )}

          {/* DESTINATION medallion (hidden under the cloche until reveal) */}
          <div
            className="absolute left-1/2 top-[258px] z-20 -translate-x-1/2"
            style={{
              width: 168,
              opacity: isReveal ? 1 : 0,
              transform: `translateX(-50%) scale(${isReveal ? 1 : 0.4})`,
              transition: "all 0.55s cubic-bezier(.2,.9,.2,1.3)",
            }}
          >
            {isReveal && (
              <div
                className="absolute -top-7 left-1/2 z-30 -translate-x-1/2"
                style={{ animation: "medCrownDrop 0.6s cubic-bezier(.2,.9,.2,1.4) both" }}
              >
                <Crown size={40} className="fill-[#FFCC02] text-[#FFCC02] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
              </div>
            )}
            <div
              className="h-[168px] w-[168px] rounded-full border-[5px] border-[#FFCC02] bg-cover bg-center shadow-[0_18px_46px_-8px_rgba(255,204,2,0.5)]"
              style={{
                backgroundImage: "url('/__mockup/images/Winner-greencurry.png')",
                animation: isReveal ? "medallionPop 0.6s cubic-bezier(.2,.9,.2,1.25) both" : "none",
              }}
            />
          </div>

          {/* CLOCHE (serving dome) — sits over the medallion, then lifts away */}
          <div
            className="absolute left-1/2 top-[238px] z-30 -translate-x-1/2"
            style={{
              transition: "transform 0.85s cubic-bezier(.3,0,.2,1), opacity 0.7s ease-out",
              transform: `translateX(-50%) translateY(${lidGone ? -330 : 0}px) scale(${lidGone ? 1.06 : 1})`,
              opacity: lidGone ? 0 : 1,
            }}
          >
            {/* steam */}
            {!lidGone &&
              [0, 1, 2].map((s) => (
                <span
                  key={s}
                  className="absolute -top-9 rounded-full bg-white/30"
                  style={{
                    left: 70 + s * 28,
                    width: 7,
                    height: 26,
                    filter: "blur(4px)",
                    animation: `steamRise 2.2s ease-in-out ${s * 0.4}s infinite`,
                  }}
                />
              ))}
            {/* knob */}
            <div
              className="absolute left-1/2 top-[-14px] z-10 h-7 w-7 -translate-x-1/2 rounded-full"
              style={{ background: "linear-gradient(140deg,#FFE9A6,#FFCC02 45%,#B98700)" }}
            />
            {/* dome */}
            <div
              className="relative h-[150px] w-[210px] overflow-hidden"
              style={{
                borderRadius: "108px 108px 18px 18px",
                background:
                  "linear-gradient(105deg,#FFE9A6 0%,#FFCC02 26%,#E0A800 52%,#FFD84D 74%,#B98700 100%)",
                boxShadow: "0 20px 44px -10px rgba(0,0,0,0.55), inset 0 6px 16px rgba(255,255,255,0.45)",
                animation: !lidGone ? "domeBob 2s ease-in-out infinite" : "none",
              }}
            >
              {/* sheen */}
              <div
                className="absolute left-[26px] top-[12px] h-[120px] w-[40px] rounded-full"
                style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.75),rgba(255,255,255,0))", filter: "blur(3px)" }}
              />
              <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 text-[40px]">🍟</div>
            </div>
          </div>

          {/* PLATE (stays) */}
          <div
            className="absolute left-1/2 top-[418px] z-10 -translate-x-1/2 rounded-[50%]"
            style={{
              width: 232,
              height: 30,
              background: "linear-gradient(180deg,#FFD84D,#C99300)",
              boxShadow: "0 14px 26px -6px rgba(0,0,0,0.55)",
            }}
          />
          <div
            className="absolute left-1/2 top-[432px] z-0 -translate-x-1/2 rounded-[50%] bg-black/45 blur-md"
            style={{ width: 210, height: 26 }}
          />

          {/* restaurant name (reveal, pre-payoff) */}
          {phase === "reveal" && (
            <div
              className="absolute left-0 right-0 top-[470px] z-20 px-6 text-center"
              style={{ animation: "popIn 0.5s cubic-bezier(.2,.9,.2,1.4) both" }}
            >
              <h2 className="text-[30px] font-black leading-none text-white">Krua Apsorn</h2>
              <p className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-300">
                <MapPin size={13} className="text-[#FFCC02]" /> Dinso Rd · 9 min away
              </p>
            </div>
          )}
        </div>

        {/* ===== CONFETTI (fry win + destination reveal) ===== */}
        {(fryCrowned || isReveal) && (
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

        {/* flash on reveal */}
        {phase === "reveal" && (
          <div className="pointer-events-none absolute inset-0 z-50 bg-white" style={{ animation: "flash 0.5s ease-out 1 both" }} />
        )}

        {/* ===== FULL-SCREEN DESTINATION ===== */}
        <DestinationScreen
          show={isPayoff}
          image="/__mockup/images/Winner-greencurry.png"
          pickLabel={winnerName}
          name="Krua Apsorn"
          rating="4.8"
          price="฿฿"
          eta="Dinso Rd · 9 min away"
          match="92%"
          onReplay={() => setCycle((c) => c + 1)}
        />

        <style>{`
          @keyframes confettiFall {
            0% { transform: translate(0,-30px) rotate(0deg); opacity: 0; }
            8% { opacity: 1; }
            100% { transform: translate(var(--x), 900px) rotate(720deg); opacity: 0.85; }
          }
          @keyframes crownDrop { 0% { transform: translateY(-22px) rotate(-12deg); opacity: 0; } 100% { transform: translateY(0) rotate(0deg); opacity: 1; } }
          @keyframes medCrownDrop { 0% { transform: translate(-50%,-26px) rotate(-12deg); opacity: 0; } 100% { transform: translate(-50%,0) rotate(0deg); opacity: 1; } }
          @keyframes beamIn { 0% { opacity: 0; } 100% { opacity: 1; } }
          @keyframes dropIn { 0% { transform: translateY(-16px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
          @keyframes pulseSoft { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
          @keyframes tipSpark { 0%,100% { opacity: 0.4; transform: translate(-50%,0) scale(0.8); } 50% { opacity: 1; transform: translate(-50%,-2px) scale(1.2); } }
          @keyframes winnerThrob { 0%,100% { box-shadow: 0 0 18px rgba(255,204,2,0.55); } 50% { box-shadow: 0 0 30px rgba(255,204,2,0.95); } }
          @keyframes domeBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          @keyframes steamRise { 0% { transform: translateY(6px); opacity: 0; } 30% { opacity: 0.6; } 100% { transform: translateY(-26px); opacity: 0; } }
          @keyframes medallionPop { 0% { transform: scale(0.6); } 60% { transform: scale(1.08); } 100% { transform: scale(1); } }
          @keyframes burst { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0; } 35% { opacity: 1; } 100% { transform: translate(-50%,-50%) scale(1.3); opacity: 0; } }
          @keyframes ringPing { 0% { transform: translate(-50%,-50%) scale(0.5); opacity: 0.8; } 100% { transform: translate(-50%,-50%) scale(2); opacity: 0; } }
          @keyframes popIn { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
          @keyframes flash { 0% { opacity: 0; } 14% { opacity: 0.8; } 100% { opacity: 0; } }
          @keyframes drumDot { 0%,100% { transform: scale(0.7); opacity: 0.4; } 50% { transform: scale(1.2); opacity: 1; } }
        `}</style>
      </div>
    </div>
  );
}
