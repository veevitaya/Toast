import React, { useState, useEffect, useMemo } from "react";
import { Navigation, Star, Clock, Crown, RotateCcw, MessageCircle, MapPin } from "lucide-react";

type Phase = "sealed" | "lifting" | "reveal" | "payoff";

export function DuelDestinationReveal() {
  const [phase, setPhase] = useState<Phase>("sealed");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setPhase("sealed");
    const timers = [
      setTimeout(() => setPhase("lifting"), 1600),
      setTimeout(() => setPhase("reveal"), 2450),
      setTimeout(() => setPhase("payoff"), 3500),
      setTimeout(() => setCycle((c) => c + 1), 10200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  const lidGone = phase === "lifting" || phase === "reveal" || phase === "payoff";
  const isReveal = phase === "reveal" || phase === "payoff";
  const isPayoff = phase === "payoff";

  const confetti = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => {
        const colors = ["#FFCC02", "#FFE17D", "#FF8A3D", "#FFF4D6", "#FFFFFF", "#FFB300"];
        return {
          id: i,
          left: Math.random() * 100,
          x: (Math.random() - 0.5) * 160,
          delay: Math.random() * 0.5,
          dur: 1.9 + Math.random() * 1.5,
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
        {/* destination spotlight wash */}
        <div
          className="absolute left-1/2 top-[210px] h-[440px] w-[440px] -translate-x-1/2 rounded-full transition-all duration-700"
          style={{
            background:
              "radial-gradient(circle, rgba(255,204,2,0.34) 0%, rgba(255,204,2,0.10) 40%, rgba(255,204,2,0) 70%)",
            opacity: isReveal ? 1 : 0,
            transform: `translateX(-50%) scale(${isReveal ? 1 : 0.4})`,
          }}
        />

        {/* ===== TOP BANNER ===== */}
        <div className="absolute left-0 right-0 top-0 z-30 px-6 pt-12 text-center">
          {/* duel result — intentionally small / settled */}
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-slate-300">
            <Crown size={13} className="fill-[#FFCC02] text-[#FFCC02]" />
            TOAST WON THE DUEL
          </div>

          {!isReveal ? (
            <>
              <h1 className="mt-4 text-[26px] font-extrabold leading-tight text-white">
                {phase === "lifting" ? "Lifting the lid…" : "Now… where to?"}
              </h1>
              <p className="mt-1.5 text-[13px] font-medium text-slate-400">
                Toast's table is still under wraps
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
              <h1 className="mt-4 text-[15px] font-bold uppercase tracking-[0.26em] text-[#FFCC02]">
                Tonight's table
              </h1>
            </div>
          )}
        </div>

        {/* ===== STAGE: cloche → destination medallion ===== */}

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
              style={{ animation: "crownDrop 0.6s cubic-bezier(.2,.9,.2,1.4) both" }}
            >
              <Crown size={40} className="fill-[#FFCC02] text-[#FFCC02] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
            </div>
          )}
          <div
            className="h-[168px] w-[168px] rounded-full border-[5px] border-[#FFCC02] bg-cover bg-center shadow-[0_18px_46px_-8px_rgba(255,204,2,0.5)]"
            style={{
              backgroundImage: "url('/__mockup/images/Winner-somtam.png')",
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
            <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 text-[44px] font-black text-[#8A6500]/30">?</div>
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
            <h2 className="text-[30px] font-black leading-none text-white">Som Tam Nua</h2>
            <p className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-300">
              <MapPin size={13} className="text-[#FFCC02]" /> Siam Square · 6 min away
            </p>
          </div>
        )}

        {/* ===== CONFETTI ===== */}
        {isReveal && (
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

        {/* ===== PAYOFF CARD ===== */}
        <div
          className="absolute bottom-0 left-0 right-0 z-40 transition-all duration-700"
          style={{ transform: isPayoff ? "translateY(0)" : "translateY(110%)", opacity: isPayoff ? 1 : 0 }}
        >
          <div className="rounded-t-[28px] bg-white px-5 pb-7 pt-5 shadow-[0_-12px_40px_rgba(0,0,0,0.5)]">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />

            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[#FFF7DA] px-2.5 py-1 text-[11px] font-extrabold text-[#A77B00]">
              <Crown size={12} className="fill-[#A77B00]" /> Toast's pick · where we're eating
            </div>
            <h3 className="text-[15px] font-bold text-slate-500">Head out together 🚗</h3>

            <div className="mt-3 flex gap-3">
              <div
                className="h-[78px] w-[78px] shrink-0 rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: "url('/__mockup/images/Winner-somtam.png')" }}
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-[20px] font-extrabold leading-tight text-[#0B1325]">Som Tam Nua</h4>
                <div className="mt-1 flex items-center gap-2 text-[13px] text-slate-500">
                  <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                    <Star size={13} className="fill-[#FFCC02] text-[#FFCC02]" /> 4.7
                  </span>
                  <span>·</span>
                  <span>฿฿</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> 6 min
                  </span>
                </div>
                <span className="mt-1.5 inline-block rounded-md bg-[#FFCC02]/20 px-2 py-0.5 text-[12px] font-extrabold text-[#A77B00]">
                  94% group match
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
            className="absolute right-4 top-12 z-50 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm"
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
          @keyframes domeBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          @keyframes steamRise { 0% { transform: translateY(6px); opacity: 0; } 30% { opacity: 0.6; } 100% { transform: translateY(-26px); opacity: 0; } }
          @keyframes medallionPop { 0% { transform: scale(0.6); } 60% { transform: scale(1.08); } 100% { transform: scale(1); } }
          @keyframes crownDrop { 0% { transform: translate(-50%,-26px) rotate(-12deg); opacity: 0; } 100% { transform: translate(-50%,0) rotate(0deg); opacity: 1; } }
          @keyframes burst { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0; } 35% { opacity: 1; } 100% { transform: translate(-50%,-50%) scale(1.3); opacity: 0; } }
          @keyframes ringPing { 0% { transform: translate(-50%,-50%) scale(0.5); opacity: 0.8; } 100% { transform: translate(-50%,-50%) scale(2); opacity: 0; } }
          @keyframes popIn { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
          @keyframes dropIn { 0% { transform: translateY(-16px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
          @keyframes flash { 0% { opacity: 0; } 14% { opacity: 0.8; } 100% { opacity: 0; } }
          @keyframes drumDot { 0%,100% { transform: scale(0.7); opacity: 0.4; } 50% { transform: scale(1.2); opacity: 1; } }
        `}</style>
      </div>
    </div>
  );
}
