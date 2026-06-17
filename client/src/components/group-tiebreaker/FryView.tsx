import { useEffect, useState } from "react";
import { Crown, Loader2, Sparkles } from "lucide-react";
import type { GroupTieBreaker } from "@shared/schema";
import {
  Avatar,
  WinnerHeroCard,
  memberName,
  memberPic,
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
}: {
  len: number;
  w: number;
  tone: number;
  lean: number;
  dim?: boolean;
}) {
  const h = 34 + len * 168;
  const light = `hsl(${mix(46, 38, tone)}, ${mix(88, 72, tone)}%, ${mix(72, 60, tone)}%)`;
  const dark = `hsl(${mix(40, 30, tone)}, ${mix(82, 66, tone)}%, ${mix(56, 44, tone)}%)`;
  return (
    <div
      style={{
        width: w,
        height: h,
        transform: `rotate(${lean}deg)`,
        transformOrigin: "bottom center",
        opacity: dim ? 0.45 : 1,
        transition: "height 0.7s cubic-bezier(0.16,1,0.3,1)",
      }}
      className="relative"
    >
      <div
        className="absolute inset-0 rounded-t-[5px] rounded-b-[3px]"
        style={{
          background: `linear-gradient(180deg, ${light}, ${dark})`,
          boxShadow: "inset 0 -6px 9px rgba(0,0,0,0.16), inset 2px 0 3px rgba(255,255,255,0.25), 0 2px 3px rgba(0,0,0,0.08)",
        }}
      />
      <div
        className="absolute left-1/2 top-1 bottom-2 w-[1.5px] -translate-x-1/2 rounded-full"
        style={{ background: "rgba(255,255,255,0.28)" }}
      />
    </div>
  );
}

function Carton({
  carton,
  onPick,
  disabled,
}: {
  carton: Fry[];
  onPick: (id: string) => void;
  disabled: boolean;
}) {
  const center = (carton.length - 1) / 2;
  return (
    <div className="relative w-full mx-auto" style={{ height: 300, maxWidth: 360 }}>
      <div className="absolute left-0 right-0 flex justify-center items-end gap-[2px] px-7" style={{ bottom: 86 }}>
        {carton.map((f, i) => (
          <button
            key={f.id}
            disabled={disabled}
            onClick={() => onPick(f.id)}
            data-testid={`button-fry-${f.id}`}
            className="relative group disabled:cursor-default"
            style={{ zIndex: 40 - Math.round(Math.abs(i - center)) }}
          >
            <div className="transition-transform duration-200 group-active:-translate-y-2 group-hover:-translate-y-3">
              <FryBody len={f.poke} w={f.w} tone={f.tone} lean={f.lean} />
            </div>
          </button>
        ))}
      </div>
      {/* carton */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[82%] h-[112px] rounded-b-[10px] rounded-t-[5px] overflow-hidden"
        style={{
          background:
            "repeating-linear-gradient(90deg, #E23744 0 14px, #ffffff 14px 28px)",
          boxShadow: "0 14px 30px -10px rgba(226,55,68,0.45), inset 0 3px 6px rgba(255,255,255,0.4)",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-[26px] bg-white/85" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black tracking-[0.25em] text-[#E23744] text-lg drop-shadow-sm">TOAST</span>
        </div>
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
      return (
        <div className="relative z-10 flex flex-col flex-1">
          <div className="absolute top-0 left-0 w-full h-[360px] bg-gradient-to-b from-[#FFCC02]/30 to-transparent pointer-events-none" />
          <div className="px-6 flex-1 flex flex-col z-10 relative pb-8 pt-14 animate-slide-up">
            <div className="text-center mb-5">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFCC02] flex items-center justify-center shadow-[0_12px_26px_-8px_rgba(255,204,2,0.75)] animate-scale-pop">
                  <Crown className="w-6 h-6 text-[#0F172A]" strokeWidth={2.5} />
                </div>
              </div>
              <h1 className="text-3xl font-extrabold toast-ink mb-2">{item.name}</h1>
              <p className="text-slate-500 font-medium text-[15px]">
                {iWon ? "Your fry was the longest — you pick!" : `${memberName(members, winnerId, meId)} pulled the longest fry.`}
              </p>
            </div>
            <WinnerHeroCard item={item} heading={item.place ? item.place : item.name} badge="LONGEST FRY WINS" />
            <div className="mt-6">
              {isHost ? (
                <button
                  onClick={onFinish}
                  disabled={finishing}
                  data-testid="button-tiebreaker-finish"
                  className="w-full toast-gold py-4 rounded-2xl font-bold text-[17px] shadow-[0_8px_20px_-6px_rgba(255,204,2,0.4)] transform active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {finishing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  Lock it in · let's eat
                </button>
              ) : (
                <div className="w-full bg-white/70 border border-black/[0.05] py-4 rounded-2xl font-bold text-[15px] toast-muted flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Waiting for the host…
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative z-10 flex flex-col flex-1">
        <div className="pt-12 pb-2 px-6 text-center">
          <span className="text-[12px] font-bold tracking-widest text-[#FFCC02] uppercase">The reveal</span>
          <h2 className="text-2xl font-extrabold toast-ink mt-1">Longest fry wins</h2>
        </div>
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
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-6 text-center">
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
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col flex-1">
      <div className="pt-12 pb-1 px-6 text-center">
        <span className="text-[12px] font-bold tracking-widest text-[#FFCC02] uppercase">Longest Fry</span>
        <h2 className="text-2xl font-extrabold toast-ink mt-1">Pull a fry</h2>
        <p className="toast-muted text-[15px] mt-1">Longest one wins the table. Choose wisely 👀</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <Carton carton={carton} onPick={onPick} disabled={pickSubmitting} />
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
