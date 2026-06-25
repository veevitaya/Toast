import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Crown, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { GroupTieBreaker } from "@shared/schema";
import { DestinationReveal } from "./DestinationReveal";
import {
  Avatar,
  memberName,
  memberPic,
  TB_EASE,
  type DisplayItem,
  type TieBreakerMember,
} from "./shared";

type Fry = { id: string; poke: number; trueLen: number; lean: number; w: number; tone: number; seed: number };

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const lenToCm = (v: number) => 7 + v * 9;

export type FryViewProps = {
  tb: GroupTieBreaker;
  itemById: Map<number, DisplayItem>;
  members: TieBreakerMember[];
  meId: string;
  isHost: boolean;
  onPick: (fryId: string) => void;
  pickSubmitting: boolean;
  pickError: string | null;
  onFinish: () => void;
  onForceFinish: () => void;
  finishing: boolean;
};

function FryBody({
  len,
  w,
  tone,
  lean,
  dim,
  seed = 0,
}: {
  len: number;
  w: number;
  tone: number;
  lean: number;
  dim?: boolean;
  seed?: number;
}) {
  const h = Math.round(30 + len * 188);
  const width = Math.round(Math.max(w + 5, 17));
  const depth = Math.max(4, Math.min(7, Math.round(width * 0.34)));
  // Appetizing golden palette; tone 0 = pale golden, tone 1 = deep crispy.
  const faceTop = `hsl(${mix(50, 45, tone).toFixed(0)} ${mix(98, 92, tone).toFixed(0)}% ${mix(80, 71, tone).toFixed(0)}%)`;
  const faceMid = `hsl(${mix(47, 42, tone).toFixed(0)} ${mix(96, 90, tone).toFixed(0)}% ${mix(70, 60, tone).toFixed(0)}%)`;
  const faceBot = `hsl(${mix(44, 38, tone).toFixed(0)} ${mix(93, 86, tone).toFixed(0)}% ${mix(60, 49, tone).toFixed(0)}%)`;
  const sideC = `hsl(${mix(40, 33, tone).toFixed(0)} ${mix(88, 80, tone).toFixed(0)}% ${mix(50, 39, tone).toFixed(0)}%)`;
  const tipC = `hsl(${mix(41, 34, tone).toFixed(0)} ${mix(92, 84, tone).toFixed(0)}% ${mix(60, 48, tone).toFixed(0)}%)`;
  // Deterministic salt flecks from the fry's seed.
  const rnd = (n: number) => {
    const x = Math.sin((seed + 1) * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const so = dim ? 0 : 0.6;
  const salt =
    `radial-gradient(circle at ${(20 + rnd(1) * 58).toFixed(0)}% ${(18 + rnd(2) * 26).toFixed(0)}%, rgba(255,255,255,${so}) 0 1px, transparent 1.7px),` +
    `radial-gradient(circle at ${(26 + rnd(3) * 52).toFixed(0)}% ${(46 + rnd(4) * 22).toFixed(0)}%, rgba(255,251,238,${(so * 0.9).toFixed(2)}) 0 0.9px, transparent 1.5px),` +
    `radial-gradient(circle at ${(30 + rnd(5) * 48).toFixed(0)}% ${(72 + rnd(6) * 18).toFixed(0)}%, rgba(255,255,255,${(so * 0.8).toFixed(2)}) 0 0.8px, transparent 1.4px)`;
  const tipH = Math.min(22, Math.max(9, Math.round(h * 0.15)));
  return (
    <div
      style={{
        width: width + depth,
        height: h,
        transform: `rotate(${lean}deg)`,
        transformOrigin: "bottom center",
        opacity: dim ? 0.5 : 1,
        filter: dim ? "saturate(0.55)" : "none",
        transition: "height 0.7s cubic-bezier(0.16,1,0.3,1)",
      }}
      className="relative"
    >
      {/* right side face → reads as 3D thickness */}
      <div
        className="absolute"
        style={{
          left: width - 1,
          top: 3,
          width: depth + 1,
          height: h - 3,
          background: `linear-gradient(180deg, ${sideC}, hsl(35 72% 33%))`,
          borderRadius: "0 4px 2px 0",
          boxShadow: "inset -1px 0 2px rgba(0,0,0,0.28)",
        }}
      />
      {/* front face */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: 0,
          top: 0,
          width,
          height: h,
          borderRadius: "5px 5px 3px 3px",
          backgroundImage: `${salt}, linear-gradient(180deg, ${faceTop} 0%, ${faceMid} 45%, ${faceBot} 100%)`,
          boxShadow:
            "inset -3px 0 5px rgba(155,95,10,0.26), inset 3px 0 4px rgba(255,255,255,0.5), inset 0 -6px 8px rgba(150,90,0,0.16), 0 2px 4px rgba(0,0,0,0.12)",
        }}
      >
        {/* crispy browned tip */}
        <div
          className="absolute inset-x-0 top-0"
          style={{ height: tipH, background: `linear-gradient(180deg, ${tipC}, transparent)`, opacity: 0.8 }}
        />
        {/* soft sheen */}
        <div
          className="absolute top-2 bottom-2"
          style={{ left: Math.max(2, Math.round(width * 0.24)), width: 1.5, background: "rgba(255,255,255,0.5)", borderRadius: 2 }}
        />
      </div>
    </div>
  );
}

function Carton({
  carton,
  onPick,
  disabled,
  pickError,
}: {
  carton: Fry[];
  onPick: (id: string) => void;
  disabled: boolean;
  pickError: string | null;
}) {
  const center = (carton.length - 1) / 2;
  const overlap = 15;

  // Hold a fry and drag it up: it tracks the finger, and once pulled past COMMIT_AT it
  // locks in (calls onPick). Released early, it snaps back. State lives here in refs so the
  // parent's 1.5s tie-breaker poll can re-render without interrupting an in-progress drag.
  const MAX_PULL = 140;
  const COMMIT_AT = 92;
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragY, setDragY] = useState(0);
  const [committedId, setCommittedId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const startYRef = useRef(0);
  const committedRef = useRef(false);
  const prevDisabledRef = useRef(disabled);

  // If a pull was submitted but we're still on the pick screen (e.g. the fry got
  // snatched), the submit flag flips back to false — reset so they can grab another.
  useEffect(() => {
    if (prevDisabledRef.current && !disabled) {
      committedRef.current = false;
      activeIdRef.current = null;
      setCommittedId(null);
      setDragId(null);
      setDragY(0);
    }
    prevDisabledRef.current = disabled;
  }, [disabled]);

  // A failed pull (e.g. the fry got snatched) should free things up to grab another,
  // even if the submit flag never visibly toggled.
  useEffect(() => {
    if (pickError) {
      committedRef.current = false;
      activeIdRef.current = null;
      setCommittedId(null);
      setDragId(null);
      setDragY(0);
    }
  }, [pickError]);

  const commit = (id: string) => {
    if (committedRef.current) return;
    committedRef.current = true;
    activeIdRef.current = null;
    setDragId(null);
    setDragY(0);
    setCommittedId(id);
    onPick(id);
  };

  const handleDown = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    if (disabled || committedRef.current || activeIdRef.current) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    activeIdRef.current = id;
    startYRef.current = e.clientY;
    setDragId(id);
    setDragY(0);
  };

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    if (committedRef.current || activeIdRef.current !== id) return;
    const dy = startYRef.current - e.clientY;
    const clamped = Math.max(0, Math.min(MAX_PULL, dy));
    setDragY(clamped);
    if (clamped >= COMMIT_AT) commit(id);
  };

  const handleUp = (_e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    if (activeIdRef.current !== id || committedRef.current) return;
    activeIdRef.current = null;
    setDragId(null);
    setDragY(0);
  };

  return (
    <div className="relative w-full mx-auto" style={{ height: 350, maxWidth: 360 }}>
      {/* soft ground shadow */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: -4,
          width: "60%",
          height: 22,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(16,24,40,0.26), transparent 70%)",
          filter: "blur(2px)",
        }}
      />
      {/* carton back wall — same rounded silhouette as the front so the interior reads as a carton, not a flat rectangle */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ bottom: 0, width: "86%", height: 242, zIndex: 1 }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="fryboxBackFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8a2a18" />
              <stop offset="0.5" stopColor="#a3331e" />
              <stop offset="1" stopColor="#5f1c0f" />
            </linearGradient>
            <linearGradient id="fryboxBackShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(0,0,0,0.3)" />
              <stop offset="0.32" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
          </defs>
          <path d="M4 18 Q 2 8 12 7 Q 50 46 88 7 Q 98 8 96 18 L 87 95 Q 86 99 80 99 L 20 99 Q 14 99 13 95 Z" fill="url(#fryboxBackFill)" />
          <path d="M4 18 Q 2 8 12 7 Q 50 46 88 7 Q 98 8 96 18 L 87 95 Q 86 99 80 99 L 20 99 Q 14 99 13 95 Z" fill="url(#fryboxBackShade)" />
        </svg>
      </div>
      {/* the bunch of fries — clipped to the carton walls so they only emerge from the top opening, never the sides */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: 125, width: "80%", zIndex: 10, overflowX: "clip", overflowY: "visible" }}
      >
        <div className="flex justify-center items-end">
          {carton.map((f, i) => {
            const isCommitted = committedId === f.id;
            const isDragging = dragId === f.id && !isCommitted;
            const lifted = dragId === f.id ? dragY : 0;
            return (
              <div
                key={f.id}
                role="button"
                aria-disabled={disabled}
                data-testid={`button-fry-${f.id}`}
                onPointerDown={(e) => handleDown(e, f.id)}
                onPointerMove={(e) => handleMove(e, f.id)}
                onPointerUp={(e) => handleUp(e, f.id)}
                onPointerCancel={(e) => handleUp(e, f.id)}
                onLostPointerCapture={(e) => handleUp(e, f.id)}
                className="relative select-none"
                style={{
                  marginLeft: i === 0 ? 0 : -overlap,
                  zIndex: isDragging || isCommitted ? 60 : 40 - Math.round(Math.abs(i - center)),
                  touchAction: "none",
                  cursor: disabled ? "default" : "grab",
                }}
              >
                <div
                  style={{
                    transform: `translateY(${isCommitted ? -(MAX_PULL + 80) : -lifted}px)`,
                    opacity: isCommitted ? 0 : 1,
                    transition: isDragging ? "none" : "transform 0.34s cubic-bezier(0.16,1,0.3,1), opacity 0.34s ease",
                    willChange: "transform",
                  }}
                >
                  <FryBody len={f.poke} w={f.w} tone={f.tone} lean={f.lean} seed={f.seed} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* carton front panel — solid red fry box, occludes the fry bottoms so they sit inside */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          bottom: 0,
          width: "86%",
          height: 236,
          zIndex: 30,
          filter: "drop-shadow(0 14px 18px rgba(214,60,44,0.3))",
        }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="fryboxFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F26A50" />
              <stop offset="1" stopColor="#DF4A33" />
            </linearGradient>
            <linearGradient id="fryboxEdge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(120,22,10,0.32)" />
              <stop offset="0.15" stopColor="rgba(120,22,10,0)" />
              <stop offset="0.85" stopColor="rgba(120,22,10,0)" />
              <stop offset="1" stopColor="rgba(120,22,10,0.34)" />
            </linearGradient>
            <linearGradient id="fryboxGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(255,255,255,0.36)" />
              <stop offset="0.55" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          {/* classic fry-box silhouette: rounded soft corners, concave opening, tapered base */}
          <path d="M4 18 Q 2 8 12 7 Q 50 46 88 7 Q 98 8 96 18 L 87 95 Q 86 99 80 99 L 20 99 Q 14 99 13 95 Z" fill="url(#fryboxFill)" />
          <path d="M4 18 Q 2 8 12 7 Q 50 46 88 7 Q 98 8 96 18 L 87 95 Q 86 99 80 99 L 20 99 Q 14 99 13 95 Z" fill="url(#fryboxEdge)" />
          <path d="M4 18 Q 2 8 12 7 Q 50 46 88 7 Q 98 8 96 18 L 87 95 Q 86 99 80 99 L 20 99 Q 14 99 13 95 Z" fill="url(#fryboxGloss)" />
          {/* center fold crease */}
          <line x1="50" y1="30" x2="50" y2="99" stroke="rgba(110,18,8,0.16)" strokeWidth="0.7" />
        </svg>
      </div>
    </div>
  );
}

export function FryView({
  tb,
  itemById,
  members,
  meId,
  isHost,
  onPick,
  pickSubmitting,
  pickError,
  onFinish,
  onForceFinish,
  finishing,
}: FryViewProps) {
  const participants = tb.participantIds || [];
  const gs = (tb.gameState || {}) as any;
  const carton: Fry[] = Array.isArray(gs.carton) ? gs.carton : [];
  const picks = (gs.picks || {}) as Record<string, string>;
  const iPicked = !!picks[meId];
  const pickedCount = participants.filter((p) => !!picks[p]).length;
  const settled = tb.status === "resolved" || tb.status === "finished";

  const [revealStep, setRevealStep] = useState(0);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    if (!settled) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    participants.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealStep(i + 1), 350 + i * 750));
    });
    const after = 350 + participants.length * 750;
    timers.push(setTimeout(() => setShowCard(true), after + 1200));
    return () => timers.forEach(clearTimeout);
  }, [settled, participants.length]);

  // ---------------- RESOLVED: reveal + winner ----------------
  if (settled) {
    const winnerId = tb.winnerLineUserId || participants[0];
    const allRevealed = revealStep >= participants.length;
    const item = tb.finalItemId != null ? itemById.get(tb.finalItemId) : undefined;

    if (showCard && item) {
      const iWon = winnerId === meId;
      const winnerLabel = memberName(members, winnerId, meId);
      return (
        <DestinationReveal
          item={item}
          pickLabel={iWon ? "Your pick" : `${winnerLabel}'s pick`}
          bannerText={iWon ? "YOUR LONGEST FRY" : `${winnerLabel.toUpperCase()}'S LONGEST FRY`}
          subline={
            iWon
              ? "Your fry was the longest — the table's headed here."
              : `${winnerLabel} pulled the longest fry — the table's headed here.`
          }
          isHost={isHost}
          onFinish={onFinish}
          finishing={finishing}
          testId="fry-destination-reveal"
        />
      );
    }

    return (
      <div className="relative z-10 flex flex-col flex-1">
        <motion.div
          className="pt-12 pb-2 px-6 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: TB_EASE }}
        >
          <span className="text-[12px] font-bold tracking-widest text-[#FFCC02] uppercase">The reveal</span>
          <h2 className="text-2xl font-extrabold toast-ink mt-1">Longest fry wins</h2>
        </motion.div>
        <div className="flex-1 flex items-end justify-center px-4 pb-16">
          <div className="flex items-end justify-center gap-3 w-full" style={{ minHeight: 300 }}>
            {participants.map((uid, i) => {
              const fid = picks[uid];
              const fry = carton.find((f) => f.id === fid);
              const revealedThis = i < revealStep;
              const isWinner = uid === winnerId && allRevealed;
              const cm = fry ? lenToCm(fry.trueLen).toFixed(1) : "0";
              return (
                <div key={uid} className="flex flex-col items-center justify-end flex-1 max-w-[88px]">
                  {isWinner && (
                    <Crown className="w-6 h-6 text-[#FFCC02] mb-1 animate-pop-in" fill="#FFCC02" strokeWidth={1.5} />
                  )}
                  <div className="flex items-end" style={{ height: 210 }}>
                    {fry ? (
                      <FryBody
                        len={revealedThis ? fry.trueLen : 0.04}
                        w={Math.max(fry.w, 14)}
                        tone={fry.tone}
                        lean={0}
                        dim={!revealedThis}
                      />
                    ) : (
                      <div className="w-3 h-8 rounded bg-black/10" />
                    )}
                  </div>
                  <div
                    className={`mt-2 text-[13px] font-extrabold ${isWinner ? "text-[#0F172A]" : "toast-muted"}`}
                  >
                    {revealedThis ? `${cm} cm` : "?"}
                  </div>
                  <div className={`toast-avatar w-9 h-9 mt-2 text-base border-2 ${isWinner ? "border-[#FFCC02]" : "border-white"}`}>
                    <Avatar pic={memberPic(members, uid)} name={memberName(members, uid, meId)} className="w-full h-full rounded-full" />
                  </div>
                  <span className="mt-1 text-[11px] font-bold toast-ink truncate max-w-[80px]">
                    {memberName(members, uid, meId)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- PLAYING: pick / waiting ----------------
  if (iPicked) {
    return (
      <motion.div
        className="relative z-10 flex flex-col flex-1 items-center justify-center px-6 text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: TB_EASE }}
      >
        <div className="w-16 h-16 rounded-2xl bg-[#FFCC02]/20 flex items-center justify-center mb-5 animate-float">
          <Sparkles className="w-8 h-8 text-[#FFCC02]" />
        </div>
        <h2 className="text-2xl font-extrabold toast-ink mb-2">Your fry is in 🍟</h2>
        <p className="toast-muted text-[15px] mb-6">No peeking at the length — it's a gamble.</p>
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2.5 rounded-full border border-[rgba(16,24,40,.05)] shadow-sm">
          <Loader2 className="w-4 h-4 animate-spin text-[#FFCC02]" />
          <span className="text-sm font-bold toast-ink">
            {pickedCount}/{participants.length} pulled
          </span>
        </div>
        {isHost && (
          <button
            onClick={onForceFinish}
            disabled={finishing}
            data-testid="button-tiebreaker-force"
            className="mt-8 text-[13px] font-semibold text-slate-400 underline underline-offset-2 disabled:opacity-50"
          >
            {finishing ? "Deciding…" : "Taking too long? Decide it now"}
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col flex-1">
      <motion.div
        className="pt-12 pb-1 px-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: TB_EASE }}
      >
        <span className="text-[12px] font-bold tracking-widest text-[#FFCC02] uppercase">Longest Fry</span>
        <h2 className="text-2xl font-extrabold toast-ink mt-1">Pull your fry</h2>
        <p className="toast-muted text-[15px] mt-1">Press a fry and drag it up to pull it out — longest wins 👀</p>
      </motion.div>
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <Carton carton={carton} onPick={onPick} disabled={pickSubmitting} pickError={pickError} />
        {pickError && (
          <p className="mt-3 text-[13px] font-semibold text-[#E23744]" data-testid="text-fry-error">
            That fry got snatched — grab another!
          </p>
        )}
        <div className="mt-3 flex items-center gap-2 text-[13px] font-semibold toast-muted">
          <span>{pickedCount}/{participants.length} pulled so far</span>
        </div>
      </div>
    </div>
  );
}
