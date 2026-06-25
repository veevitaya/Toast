import React, { useState, useEffect, useMemo } from "react";
import { Navigation, Star, Clock, Zap, RotateCcw, Trophy, MessageCircle } from "lucide-react";

type Phase = "faceoff" | "drum" | "reveal" | "payoff";

export function WinnerReveal() {
  const [phase, setPhase] = useState<Phase>("faceoff");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setPhase("faceoff");
    const timers = [
      setTimeout(() => setPhase("drum"), 1400),
      setTimeout(() => setPhase("reveal"), 2750),
      setTimeout(() => setPhase("payoff"), 3750),
      setTimeout(() => setCycle((c) => c + 1), 9500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  const isReveal = phase === "reveal" || phase === "payoff";
  const isPayoff = phase === "payoff";

  const confetti = useMemo(
    () =>
      Array.from({ length: 52 }).map((_, i) => {
        const colors = ["#FFCC02", "#FFE17D", "#FF8A3D", "#FFF4D6", "#FFFFFF", "#FFB300"];
        return {
          id: i,
          left: Math.random() * 100,
          x: (Math.random() - 0.5) * 160,
          delay: Math.random() * 0.5,
          dur: 1.8 + Math.random() * 1.6,
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
        {/* base atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_-5%,#1C2A47_0%,#0C1325_52%,#070B16_100%)]" />
        {/* winner spotlight wash */}
        <div
          className="absolute left-1/2 top-[60px] h-[520px] w-[520px] -translate-x-1/2 rounded-full transition-all duration-700"
          style={{
            background:
              "radial-gradient(circle, rgba(255,204,2,0.32) 0%, rgba(255,204,2,0.10) 38%, rgba(255,204,2,0) 70%)",
            opacity: isReveal ? 1 : 0,
            transform: `translateX(-50%) scale(${isReveal ? 1 : 0.4})`,
          }}
        />

        {/* ===== TOP BANNER ===== */}
        <div className="absolute left-0 right-0 top-0 z-30 px-6 pt-12 text-center">
          {!isReveal ? (
            <>
              <div
                className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-[#FFCC02]/40 bg-[#FFCC02]/10 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.18em] text-[#FFCC02]"
                style={{ animation: phase === "drum" ? "pulseSoft 0.55s ease-in-out infinite" : "none" }}
              >
                <Zap size={13} className="fill-[#FFCC02]" />
                {phase === "drum" ? "DECIDING…" : "SUDDEN DEATH"}
              </div>
              <h1 className="mt-4 text-[26px] font-extrabold leading-tight text-white">
                {phase === "drum" ? "Who takes it?" : "It's a tie!"}
              </h1>
              <p className="mt-1 text-[13px] font-medium text-slate-400">
                Toast &amp; Waffle settle this one
              </p>
            </>
          ) : (
            <div style={{ animation: "dropIn 0.5s cubic-bezier(.2,.9,.2,1.2) both" }}>
              <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-[#FFCC02] px-3 py-1 text-[11px] font-extrabold tracking-[0.18em] text-[#0B1325]">
                <Trophy size={13} className="fill-[#0B1325]" />
                WINNER
              </div>
            </div>
          )}
        </div>

        {/* ===== MASCOT STAGE ===== */}
        {/* winner glow ring pings */}
        {isReveal && (
          <>
            <div
              className="absolute left-[195px] top-[235px] z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#FFCC02]"
              style={{ animation: "ringPing 1.1s ease-out 1" }}
            />
            <div
              className="absolute left-[195px] top-[235px] z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFCC02]"
              style={{ animation: "glowPulse 1.8s ease-in-out infinite", filter: "blur(26px)", opacity: 0.5 }}
            />
          </>
        )}

        {/* TOAST — the winner */}
        <div
          className="absolute z-20"
          style={{
            width: 150,
            left: isReveal ? (isPayoff ? 152 : 120) : 38,
            top: isReveal ? (isPayoff ? 78 : 150) : 296,
            transform: `scale(${isReveal ? (isPayoff ? 0.7 : 1.2) : 1})`,
            transition: "all 0.85s cubic-bezier(.2,.9,.25,1.15)",
          }}
        >
          <img
            src="/__mockup/images/toast-mascot.png"
            alt="Toast"
            className="w-full drop-shadow-[0_14px_30px_rgba(0,0,0,0.45)]"
            style={{
              animation:
                phase === "faceoff"
                  ? "idleBob 1.6s ease-in-out infinite"
                  : phase === "drum"
                  ? "rattle 0.18s linear infinite"
                  : "winnerHop 0.6s cubic-bezier(.2,.9,.2,1.3) 1",
            }}
          />
        </div>

        {/* WAFFLE — the loser */}
        <div
          className="absolute z-10"
          style={{
            width: 150,
            right: isReveal ? 30 : 38,
            top: isReveal ? 360 : 296,
            transform: `scale(${isReveal ? 0.62 : 1})`,
            opacity: isPayoff ? 0 : isReveal ? 0.45 : 1,
            filter: isReveal ? "grayscale(1) brightness(0.85)" : "none",
            transition: "all 0.8s cubic-bezier(.3,.7,.3,1)",
          }}
        >
          <img
            src="/__mockup/images/waffle-mascot.png"
            alt="Waffle"
            className="w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
            style={{
              animation:
                phase === "faceoff"
                  ? "idleBob 1.6s ease-in-out infinite 0.3s"
                  : phase === "drum"
                  ? "rattle 0.18s linear infinite 0.09s"
                  : "loserSlump 0.7s ease-out 1 both",
            }}
          />
        </div>

        {/* VS badge */}
        <div
          className="absolute left-1/2 top-[330px] z-20 -translate-x-1/2 transition-all duration-300"
          style={{ opacity: isReveal ? 0 : 1, transform: `translateX(-50%) scale(${isReveal ? 0.4 : 1})` }}
        >
          <div
            className="grid h-14 w-14 place-items-center rounded-full bg-white text-[18px] font-black italic text-[#0B1325] shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            style={{ animation: phase === "drum" ? "rattle 0.16s linear infinite" : "none" }}
          >
            VS
          </div>
        </div>

        {/* WINNER headline (reveal only) */}
        {phase === "reveal" && (
          <div
            className="absolute left-0 right-0 top-[470px] z-20 px-6 text-center"
            style={{ animation: "popIn 0.5s cubic-bezier(.2,.9,.2,1.4) both" }}
          >
            <h2 className="text-[34px] font-black leading-none text-white">
              TEAM <span className="text-[#FFCC02]">TOAST</span>
            </h2>
            <p className="mt-1 text-[15px] font-bold tracking-wide text-slate-300">wins the tie-breaker 🎉</p>
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
          <div className="pointer-events-none absolute inset-0 z-50 bg-white" style={{ animation: "flash 0.55s ease-out 1 both" }} />
        )}

        {/* ===== PAYOFF CARD ===== */}
        <div
          className="absolute bottom-0 left-0 right-0 z-40 transition-all duration-700"
          style={{
            transform: isPayoff ? "translateY(0)" : "translateY(110%)",
            opacity: isPayoff ? 1 : 0,
          }}
        >
          <div className="rounded-t-[28px] bg-white px-5 pb-7 pt-5 shadow-[0_-12px_40px_rgba(0,0,0,0.5)]">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />

            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[#FFF7DA] px-2.5 py-1 text-[11px] font-extrabold text-[#A77B00]">
              <Trophy size={12} className="fill-[#A77B00]" /> Team Toast picked
            </div>
            <h3 className="text-[15px] font-bold text-slate-500">We're going to 🚗</h3>

            <div className="mt-3 flex gap-3">
              <div
                className="h-[78px] w-[78px] shrink-0 rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: "url('/__mockup/images/Winner-khaosoi.png')" }}
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-[20px] font-extrabold leading-tight text-[#0B1325]">
                  Err Urban Rustic Thai
                </h4>
                <div className="mt-1 flex items-center gap-2 text-[13px] text-slate-500">
                  <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                    <Star size={13} className="fill-[#FFCC02] text-[#FFCC02]" /> 4.8
                  </span>
                  <span>·</span>
                  <span>฿฿</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> 8 min
                  </span>
                </div>
                <span className="mt-1.5 inline-block rounded-md bg-[#FFCC02]/20 px-2 py-0.5 text-[12px] font-extrabold text-[#A77B00]">
                  96% group match
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

        {/* replay hint */}
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
          @keyframes idleBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
          @keyframes rattle {
            0%,100% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-3px) rotate(-3deg); }
            75% { transform: translateX(3px) rotate(3deg); }
          }
          @keyframes winnerHop {
            0% { transform: translateY(0) scale(1); }
            45% { transform: translateY(-22px) scale(1.06); }
            100% { transform: translateY(0) scale(1); }
          }
          @keyframes loserSlump {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(10px) rotate(8deg); }
          }
          @keyframes glowPulse { 0%,100% { opacity: 0.45; transform: scale(1); } 50% { opacity: 0.75; transform: scale(1.1); } }
          @keyframes ringPing { 0% { transform: translate(-50%,-50%) scale(0.5); opacity: 0.8; } 100% { transform: translate(-50%,-50%) scale(2.1); opacity: 0; } }
          @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
          @keyframes dropIn { 0% { transform: translateY(-16px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
          @keyframes flash { 0% { opacity: 0; } 14% { opacity: 0.85; } 100% { opacity: 0; } }
          @keyframes pulseSoft { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
        `}</style>
      </div>
    </div>
  );
}
