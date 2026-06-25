import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Crown, Star, MapPin, Loader2 } from "lucide-react";
import type { DisplayItem } from "./shared";

type Phase = "sealed" | "lifting" | "reveal" | "payoff";

export type DestinationRevealProps = {
  item: DisplayItem;
  /** Gold chip on the hero, e.g. "Your pick" / "Mali's pick". */
  pickLabel: string;
  /** Small uppercase banner above the cloche, e.g. "YOU WON THE DUEL". */
  bannerText: string;
  /** One-line celebratory sentence in the result panel. */
  subline: string;
  isHost: boolean;
  onFinish: () => void;
  finishing: boolean;
  testId?: string;
};

const CONFETTI_COLORS = ["#FFCC02", "#FFE17D", "#FF8A3D", "#FFF4D6", "#FFFFFF", "#FFB300"];

// Cinematic "where are we eating" reveal shared by both tie-breaker games: a golden
// cloche lifts to unveil the winning spot, then a full-screen destination card. The
// phase timer runs ONCE on mount and parks on the payoff; the host's "Lock it in"
// button drives the real /finish handoff (non-hosts wait).
export function DestinationReveal({
  item,
  pickLabel,
  bannerText,
  subline,
  isHost,
  onFinish,
  finishing,
  testId,
}: DestinationRevealProps) {
  const [phase, setPhase] = useState<Phase>("sealed");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("lifting"), 1500),
      setTimeout(() => setPhase("reveal"), 2350),
      // Hold on the confetti reveal a good while before the opaque payoff card
      // (z-60) slides over and hides it — this gap IS the visible confetti time.
      setTimeout(() => setPhase("payoff"), 8500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const lidGone = phase !== "sealed";
  const isReveal = phase === "reveal" || phase === "payoff";
  const isPayoff = phase === "payoff";
  const hasImg = !!item.image;
  // The destination is always the restaurant (item.place). In menu-mode tie-breakers
  // item.name is the winning dish, so surface it as supporting context, not the title.
  const destName = item.place || item.name;
  const dish = item.place && item.place !== item.name ? item.name : null;

  // One-shot pop that bursts out from the screen centre. Flakes are thin paper
  // rectangles (a few round foil dots) with a random tilt + tumble speed so the
  // 3D flip animation reads as real confetti rather than flying dots.
  const burst = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 140 + Math.random() * 240;
        const w = 5 + Math.random() * 6;
        const round = Math.random() < 0.18;
        return {
          id: i,
          w,
          h: round ? w : w * (1.3 + Math.random() * 1.4),
          round,
          tx: Math.cos(angle) * velocity,
          ty: Math.sin(angle) * velocity,
          g: 140 + Math.random() * 200,
          tilt: (Math.random() - 0.5) * 50,
          tdur: 0.5 + Math.random() * 0.9,
          delay: Math.random() * 0.12,
          dur: 1.1 + Math.random() * 0.7,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        };
      }),
    [],
  );

  // Continuous flutter rain that keeps falling from the top after the pop.
  const fall = useMemo(
    () =>
      Array.from({ length: 44 }).map((_, i) => {
        const w = 5 + Math.random() * 6;
        const round = Math.random() < 0.18;
        return {
          id: i,
          w,
          h: round ? w : w * (1.3 + Math.random() * 1.4),
          round,
          left: Math.random() * 100,
          sway: 14 + Math.random() * 42,
          tilt: (Math.random() - 0.5) * 50,
          tdur: 0.5 + Math.random() * 0.9,
          delay: 0.4 + Math.random() * 2.2,
          dur: 2.8 + Math.random() * 2.6,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        };
      }),
    [],
  );

  return (
    <div
      className="tbd-reveal absolute inset-0 z-[60] overflow-hidden bg-[#070B16]"
      data-testid={testId || "tiebreaker-destination-reveal"}
    >
      {/* atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_-5%,#1C2A47_0%,#0C1325_52%,#070B16_100%)]" />

      {/* ===== TOP BANNER ===== */}
      <div className="absolute left-0 right-0 top-0 z-30 px-6 pt-12 text-center">
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-slate-300">
          <Crown size={13} className="fill-[#FFCC02] text-[#FFCC02]" />
          {bannerText}
        </div>

        {!isReveal ? (
          <>
            <h1 className="mt-4 text-[26px] font-bold leading-tight text-white">
              {phase === "lifting" ? "Lifting the lid…" : "Now… where to?"}
            </h1>
            <p className="mt-1.5 text-[13px] font-medium text-slate-400">
              The table's pick is under wraps
            </p>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-[#FFCC02]"
                  style={{ animation: `tbd-drumDot 1s ease-in-out ${d * 0.18}s infinite` }}
                />
              ))}
            </div>
          </>
        ) : (
          <div style={{ animation: "tbd-dropIn 0.5s cubic-bezier(.2,.9,.2,1.2) both" }}>
            <h1 className="mt-4 text-[15px] font-bold uppercase tracking-[0.26em] text-[#FFCC02]">
              The pick is in
            </h1>
          </div>
        )}
      </div>

      {/* ===== STAGE: cloche → destination medallion (vertically centered) ===== */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: 232, height: 224 }}>
          {/* spotlight wash */}
          <div
            className="absolute left-1/2 top-[104px] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700"
            style={{
              background:
                "radial-gradient(circle, rgba(255,204,2,0.30) 0%, rgba(255,204,2,0.08) 42%, rgba(255,204,2,0) 70%)",
              opacity: isReveal ? 1 : 0,
              transform: `translate(-50%,-50%) scale(${isReveal ? 1 : 0.5})`,
            }}
          />

          {/* burst light + ping ring behind medallion */}
          {isReveal && (
            <div
              className="tbd-decor absolute left-1/2 top-[104px] z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,204,2,0.30) 35%, rgba(255,204,2,0) 68%)",
                animation: "tbd-burst 0.7s ease-out both",
              }}
            />
          )}
          {isReveal && (
            <div
              className="tbd-decor absolute left-1/2 top-[104px] z-10 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#FFCC02]"
              style={{ animation: "tbd-ringPing 1.1s ease-out 1" }}
            />
          )}

          {/* DESTINATION medallion (hidden under the cloche until reveal) */}
          <div
            className="absolute left-1/2 top-[20px] z-20 -translate-x-1/2"
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
                style={{ animation: "tbd-crownDrop 0.6s cubic-bezier(.2,.9,.2,1.4) both" }}
              >
                <Crown size={40} className="fill-[#FFCC02] text-[#FFCC02] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
              </div>
            )}
            {hasImg ? (
              <div
                className="h-[168px] w-[168px] rounded-full border-[5px] border-[#FFCC02] bg-cover bg-center shadow-[0_18px_46px_-8px_rgba(255,204,2,0.5)]"
                style={{
                  backgroundImage: `url('${item.image}')`,
                  animation: isReveal ? "tbd-medallionPop 0.6s cubic-bezier(.2,.9,.2,1.25) both" : "none",
                }}
              />
            ) : (
              <div
                className="flex h-[168px] w-[168px] items-center justify-center rounded-full border-[5px] border-[#FFCC02] text-6xl shadow-[0_18px_46px_-8px_rgba(255,204,2,0.5)]"
                style={{
                  background: "linear-gradient(160deg,#FFE9A6,#FFCC02 55%,#E0A800)",
                  animation: isReveal ? "tbd-medallionPop 0.6s cubic-bezier(.2,.9,.2,1.25) both" : "none",
                }}
              >
                {item.emoji}
              </div>
            )}
          </div>

          {/* CLOCHE (serving dome) — sits over the medallion, then lifts away */}
          <div
            className="absolute left-1/2 top-0 z-30 -translate-x-1/2"
            style={{
              transition: "transform 0.85s cubic-bezier(.3,0,.2,1), opacity 0.7s ease-out",
              transform: `translateX(-50%) translateY(${lidGone ? -360 : 0}px) scale(${lidGone ? 1.06 : 1})`,
              opacity: lidGone ? 0 : 1,
            }}
          >
            {/* steam */}
            {!lidGone && (
              <div className="tbd-decor">
                {[0, 1, 2].map((s) => (
                  <span
                    key={s}
                    className="absolute -top-9 rounded-full bg-white/30"
                    style={{
                      left: 70 + s * 28,
                      width: 7,
                      height: 26,
                      filter: "blur(4px)",
                      animation: `tbd-steamRise 2.2s ease-in-out ${s * 0.4}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}
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
                animation: !lidGone ? "tbd-domeBob 2s ease-in-out infinite" : "none",
              }}
            >
              {/* sheen */}
              <div
                className="absolute left-[26px] top-[12px] h-[120px] w-[40px] rounded-full"
                style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.75),rgba(255,255,255,0))", filter: "blur(3px)" }}
              />
              <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 text-[44px] font-black text-[#8A6500]/30">
                ?
              </div>
            </div>
          </div>

          {/* PLATE (stays) */}
          <div
            className="absolute left-1/2 top-[180px] z-10 -translate-x-1/2 rounded-[50%]"
            style={{
              width: 232,
              height: 30,
              background: "linear-gradient(180deg,#FFD84D,#C99300)",
              boxShadow: "0 14px 26px -6px rgba(0,0,0,0.55)",
            }}
          />
          <div
            className="absolute left-1/2 top-[194px] z-0 -translate-x-1/2 rounded-[50%] bg-black/45 blur-md"
            style={{ width: 210, height: 26 }}
          />

          {/* restaurant name (reveal, pre-payoff) */}
          {phase === "reveal" && (
            <div className="absolute left-1/2 top-[228px] z-20 w-[320px] -translate-x-1/2 text-center">
              <div style={{ animation: "tbd-popIn 0.5s cubic-bezier(.2,.9,.2,1.4) both" }}>
                <h2 className="text-[28px] font-black leading-none text-white">{destName}</h2>
                {dish && (
                  <p className="mt-1.5 text-[13px] font-bold text-[#FFCC02]">for {dish}</p>
                )}
                {item.area && (
                  <p className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-300">
                    <MapPin size={13} className="text-[#FFCC02]" /> {item.area}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== CONFETTI ===== */}
      {isReveal && (
        <div className="tbd-decor pointer-events-none absolute inset-0 z-40 overflow-hidden">
          {/* one-shot pop from the centre */}
          {burst.map((c) => (
            <span
              key={`burst-${c.id}`}
              className="absolute left-1/2 top-1/2"
              style={
                {
                  width: c.w,
                  height: c.h,
                  perspective: "500px",
                  ["--tx" as any]: `${c.tx}px`,
                  ["--ty" as any]: `${c.ty}px`,
                  ["--g" as any]: `${c.g}px`,
                  animation: `tbd-confettiBurst ${c.dur}s cubic-bezier(0.16,0.84,0.44,1) ${c.delay}s forwards`,
                } as CSSProperties
              }
            >
              <span
                className="block h-full w-full"
                style={
                  {
                    background: c.color,
                    borderRadius: c.round ? "50%" : 1,
                    ["--tilt" as any]: `${c.tilt}deg`,
                    animation: `tbd-confettiTumble ${c.tdur}s linear ${c.delay}s infinite`,
                  } as CSSProperties
                }
              />
            </span>
          ))}
          {/* continuous flutter rain falling from the top */}
          {fall.map((c) => (
            <span
              key={`fall-${c.id}`}
              className="absolute top-0"
              style={
                {
                  left: `${c.left}%`,
                  width: c.w,
                  height: c.h,
                  perspective: "500px",
                  ["--sway" as any]: `${c.sway}px`,
                  animation: `tbd-confettiFall ${c.dur}s linear ${c.delay}s infinite`,
                } as CSSProperties
              }
            >
              <span
                className="block h-full w-full"
                style={
                  {
                    background: c.color,
                    borderRadius: c.round ? "50%" : 1,
                    ["--tilt" as any]: `${c.tilt}deg`,
                    animation: `tbd-confettiTumble ${c.tdur}s linear ${c.delay}s infinite`,
                  } as CSSProperties
                }
              />
            </span>
          ))}
        </div>
      )}

      {/* flash on reveal */}
      {phase === "reveal" && (
        <div
          className="tbd-decor pointer-events-none absolute inset-0 z-50 bg-white"
          style={{ animation: "tbd-flash 0.5s ease-out 1 both" }}
        />
      )}

      {/* ===== FULL-SCREEN DESTINATION ===== */}
      <DestinationScreen
        show={isPayoff}
        item={item}
        pickLabel={pickLabel}
        subline={subline}
        isHost={isHost}
        onFinish={onFinish}
        finishing={finishing}
      />
    </div>
  );
}

function DestinationScreen({
  show,
  item,
  pickLabel,
  subline,
  isHost,
  onFinish,
  finishing,
}: {
  show: boolean;
  item: DisplayItem;
  pickLabel: string;
  subline: string;
  isHost: boolean;
  onFinish: () => void;
  finishing: boolean;
}) {
  const hasImg = !!item.image;
  const destName = item.place || item.name;
  const dish = item.place && item.place !== item.name ? item.name : null;
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
      {/* hero */}
      <div className="relative w-full shrink-0 overflow-hidden" style={{ height: "min(560px, 62dvh)" }}>
        {hasImg ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${item.image}')`, animation: show ? "tbd-kenburns 7s ease-out both" : "none" }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-[120px]"
            style={{ background: "linear-gradient(160deg,#FFE9A6,#FFCC02 55%,#E0A800)" }}
          >
            {item.emoji}
          </div>
        )}
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
            {destName}
          </h2>
          {dish && (
            <p className="mt-1 text-[14px] font-bold text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              for {dish}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-white/90">
            <span className="inline-flex items-center gap-1">
              <Star size={13} className="fill-[#FFCC02] text-[#FFCC02]" /> {item.rating}
            </span>
            <span className="opacity-60">·</span>
            <span>{item.price}</span>
            {item.area && (
              <>
                <span className="opacity-60">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} className="text-[#FFCC02]" /> {item.area}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* panel */}
      <div className="relative z-10 -mt-6 flex flex-1 flex-col rounded-t-[28px] bg-white px-6 pb-7 pt-5">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFCC02]/20 px-2.5 py-1 text-[12px] font-extrabold text-[#A77B00]">
            The table's pick
          </span>
          {item.cuisine && (
            <span className="max-w-[48%] truncate text-[12px] font-semibold text-slate-400">{item.cuisine}</span>
          )}
        </div>
        <p className="mt-3 text-[16px] font-bold leading-snug text-slate-600">{subline}</p>

        <div className="mt-auto pt-5">
          {isHost ? (
            <button
              onClick={onFinish}
              disabled={finishing}
              data-testid="button-tiebreaker-finish"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#FFCC02] text-[17px] font-extrabold text-[#0B1325] shadow-[0_10px_28px_-6px_rgba(255,204,2,0.55)] transition-transform active:scale-[0.97] disabled:opacity-60"
            >
              {finishing ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              Lock it in · let's eat
            </button>
          ) : (
            <div className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-slate-100 text-[15px] font-bold text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Waiting for the host…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
