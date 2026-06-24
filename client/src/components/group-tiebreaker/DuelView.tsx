import { useEffect, useState } from "react";
import { Star, Crown, Swords, Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { GroupTieBreaker } from "@shared/schema";
import {
  Avatar,
  WinnerHeroCard,
  memberName,
  memberPic,
  type DisplayItem,
  type TieBreakerMember,
  type SwipeMode,
} from "./shared";

type RpsMove = "rock" | "paper" | "scissors";
const MOVES: RpsMove[] = ["rock", "paper", "scissors"];
const HAND: Record<RpsMove, string> = { rock: "✊", paper: "✋", scissors: "✌️" };
const VERB: Record<RpsMove, string> = { rock: "smashes", paper: "covers", scissors: "cuts" };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const WINS_NEEDED = 2;

type Round = { moves: Record<string, RpsMove>; winner: string };

export type DuelViewProps = {
  tb: GroupTieBreaker;
  itemById: Map<number, DisplayItem>;
  members: TieBreakerMember[];
  meId: string;
  isHost: boolean;
  swipeType: SwipeMode;
  onMove: (move: RpsMove) => void;
  moveSubmitting: boolean;
  onFinish: () => void;
  onForceFinish: () => void;
  finishing: boolean;
};

function ScorePips({ score, gold }: { score: number; gold?: boolean }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: WINS_NEEDED }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i < score ? (gold ? "bg-[#FFCC02]" : "bg-[#0F172A]") : "bg-black/10"}`}
        />
      ))}
    </div>
  );
}

function TypingDots() {
  return (
    <span aria-hidden className="flex items-end gap-1">
      {[0, 0.2, 0.4].map((d) => (
        <span key={d} className="rps-dot w-1.5 h-1.5 rounded-full bg-[#FFCC02]" style={{ animationDelay: `${d}s` }} />
      ))}
    </span>
  );
}

export function DuelView({
  tb,
  itemById,
  members,
  meId,
  isHost,
  swipeType,
  onMove,
  moveSubmitting,
  onFinish,
  onForceFinish,
  finishing,
}: DuelViewProps) {
  const { locale } = useLanguage();
  const participants = tb.participantIds || [];
  const oppId = participants.find((p) => p !== meId) || participants[0] || "";
  const gs = (tb.gameState || {}) as any;
  const scores = (gs.scores || {}) as Record<string, number>;
  const rounds: Round[] = Array.isArray(gs.rounds) ? gs.rounds : [];
  const pending = (gs.pendingMoves || {}) as Record<string, RpsMove>;
  const myScore = scores[meId] || 0;
  const oppScore = scores[oppId] || 0;
  const matchOver = tb.status === "resolved" || tb.status === "finished";

  const oppName = memberName(members, oppId, meId);
  const oppPic = memberPic(members, oppId);
  const myPic = memberPic(members, meId);

  const [revealed, setRevealed] = useState(0);
  const [chant, setChant] = useState<string | null>(null);

  const hasNewRound = rounds.length > revealed;

  useEffect(() => {
    if (!hasNewRound) {
      setChant(null);
      return;
    }
    setChant("Rock");
    const t1 = setTimeout(() => setChant("Paper"), 380);
    const t2 = setTimeout(() => setChant("Scissors"), 760);
    const t3 = setTimeout(() => setChant("Shoot!"), 1050);
    const t4 = setTimeout(() => setChant(null), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [hasNewRound, revealed]);

  let stage: "throw" | "waiting" | "reveal" | "winner";
  if (hasNewRound) stage = "reveal";
  else if (matchOver) stage = "winner";
  else if (pending[meId]) stage = "waiting";
  else stage = "throw";

  const roundNum = myScore + oppScore + 1;

  const AvatarBubble = ({ id, gold }: { id: string; gold?: boolean }) => (
    <div className={`toast-avatar w-9 h-9 text-lg border-2 ${gold ? "border-[#FFCC02]" : "border-white"}`}>
      <Avatar pic={id === meId ? myPic : oppPic} name={memberName(members, id, meId)} className="w-full h-full rounded-full" />
    </div>
  );

  // ---------------- WINNER ----------------
  if (stage === "winner") {
    const iWon = tb.winnerLineUserId === meId;
    const item = tb.finalItemId != null ? itemById.get(tb.finalItemId) : undefined;
    const heading = item ? (swipeType === "menu" ? item.name : item.name) : "Dinner sorted";
    return (
      <div className="relative z-10 flex flex-col flex-1">
        <div className="absolute top-0 left-0 w-full h-[360px] bg-gradient-to-b from-[#FFCC02]/30 to-transparent pointer-events-none" />
        <div className="pt-12 pb-2 px-6 flex justify-center items-center z-10 relative">
          <div className="flex flex-col items-center">
            <span className="text-[13px] font-bold tracking-widest text-[#FFCC02] uppercase">Winner's Choice</span>
            <span className="text-[12px] font-bold toast-ink">
              {myScore} – {oppScore}
            </span>
          </div>
        </div>

        <div className="px-6 flex-1 flex flex-col z-10 relative pb-8 mt-2 animate-slide-up">
          <div className="text-center mb-5 relative">
            <div className="relative flex justify-center mb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFCC02] flex items-center justify-center shadow-[0_12px_26px_-8px_rgba(255,204,2,0.75)] animate-scale-pop">
                <Crown className="w-6 h-6 text-[#0F172A]" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="relative text-3xl font-extrabold toast-ink mb-2">{heading}</h1>
            <p className="relative text-slate-500 font-medium text-[15px]">
              {iWon ? "Your champion takes the crown." : `${oppName}'s champion takes the crown.`}
            </p>
          </div>

          {item && <WinnerHeroCard item={item} heading={item.place && swipeType === "menu" ? item.place : item.name} badge="DINNER SORTED" />}

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

  // ---------------- REVEAL ----------------
  if (stage === "reveal") {
    const round = rounds[revealed];
    const myMove = round.moves[meId];
    const oppMove = round.moves[oppId];
    const result: "win" | "lose" | "tie" =
      round.winner === "tie" ? "tie" : round.winner === meId ? "win" : "lose";
    const isFinalRound = matchOver && revealed === rounds.length - 1;

    if (chant) {
      return (
        <div className="relative z-10 flex flex-col flex-1">
          <Scoreboard
            myScore={myScore}
            oppScore={oppScore}
            roundNum={roundNum}
            meId={meId}
            oppId={oppId}
            AvatarBubble={AvatarBubble}
          />
          <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-6">
            <div className="flex items-center justify-center gap-12 h-[180px] mb-8">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-5xl border-2 border-[#FFCC02] shadow-[0_10px_28px_-6px_rgba(255,204,2,0.5)] animate-windup-left overflow-hidden">
                <Avatar pic={myPic} name="You" className="w-full h-full rounded-full" />
              </div>
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-5xl border-2 border-white shadow-[0_10px_28px_-6px_rgba(15,23,42,0.25)] animate-windup-right overflow-hidden">
                <Avatar pic={oppPic} name={oppName} className="w-full h-full rounded-full" />
              </div>
            </div>
            <div
              key={chant}
              className={`font-black animate-pop-in ${chant === "Shoot!" ? "text-7xl text-[#FFCC02] drop-shadow-[0_4px_16px_rgba(255,204,2,0.5)]" : "text-5xl toast-ink"}`}
            >
              {chant}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative z-10 flex flex-col flex-1">
        <div className="absolute inset-0 bg-[#FFCC02]/10 animate-pulse pointer-events-none" />
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
          <div className="relative w-full h-[300px] flex items-center justify-center mt-6">
            <div className="absolute top-0 right-8 flex flex-col items-center animate-clash-right">
              <span className={`text-[104px] drop-shadow-xl transform -rotate-12 ${result === "win" ? "opacity-50 grayscale" : ""}`}>
                {HAND[oppMove]}
              </span>
              <div className="mt-1 bg-white px-4 py-1.5 rounded-full shadow-sm font-bold text-sm text-slate-500">{oppName}</div>
            </div>
            <div className="absolute bottom-0 left-8 flex flex-col items-center animate-clash-left">
              <div className="mb-1 bg-[#FFCC02] px-4 py-1.5 rounded-full shadow-sm font-bold text-sm text-[#0F172A]">You</div>
              <span className={`text-[124px] drop-shadow-[0_10px_40px_rgba(255,204,2,0.4)] transform rotate-12 ${result === "lose" ? "opacity-50 grayscale" : ""}`}>
                {HAND[myMove]}
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              {result !== "tie" && <div className="absolute w-44 h-44 rounded-full border-4 border-[#FFCC02]/50 animate-ring-pop" />}
            </div>
          </div>

          <div className="w-full text-center px-2 animate-slide-up pb-8">
            <div
              className={`inline-block font-black px-7 py-3.5 rounded-3xl shadow-2xl transform -rotate-2 ${
                result === "tie"
                  ? "bg-[#FFCC02] text-[#0F172A] text-2xl"
                  : isFinalRound && result === "win"
                    ? "bg-[#0F172A] text-white text-3xl"
                    : isFinalRound && result === "lose"
                      ? "bg-white toast-ink text-3xl"
                      : "bg-[#0F172A] text-white text-2xl"
              }`}
            >
              {result === "tie"
                ? "TIE!"
                : isFinalRound
                  ? result === "win"
                    ? "YOU WIN!"
                    : `${oppName.toUpperCase()} WINS!`
                  : result === "win"
                    ? "ROUND WON"
                    : "ROUND LOST"}
            </div>
            <p className="mt-3 text-[15px] font-bold text-slate-600">
              {result === "tie"
                ? "Same move — throw again!"
                : `${cap(result === "win" ? myMove : oppMove)} ${VERB[result === "win" ? myMove : oppMove]} ${cap(result === "win" ? oppMove : myMove)}`}
            </p>
            <div className="mt-3 inline-flex items-center gap-3 bg-white/70 px-4 py-1.5 rounded-full border border-[rgba(16,24,40,.05)]">
              <span className="text-sm font-bold toast-ink">You {myScore}</span>
              <span className="text-xs text-slate-400">–</span>
              <span className="text-sm font-bold toast-ink">{oppScore} {oppName}</span>
            </div>
            <button
              onClick={() => setRevealed((r) => r + 1)}
              data-testid="button-reveal-continue"
              className="mt-6 w-full toast-gold py-4 rounded-2xl font-bold text-[17px] shadow-[0_8px_20px_-6px_rgba(255,204,2,0.4)] transform active:scale-95 transition-all"
            >
              {result === "tie" ? "Throw again" : isFinalRound ? "See what's for dinner →" : "Next round →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- THROW / WAITING ----------------
  return (
    <div className="relative z-10 flex flex-col flex-1">
      <Scoreboard
        myScore={myScore}
        oppScore={oppScore}
        roundNum={roundNum}
        meId={meId}
        oppId={oppId}
        AvatarBubble={AvatarBubble}
      />
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 -mt-4">
        {stage === "waiting" ? (
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-5xl border-2 border-[#FFCC02] shadow-[0_10px_28px_-6px_rgba(255,204,2,0.5)] mb-5 overflow-hidden">
              <span className="text-5xl">{HAND[pending[meId]]}</span>
            </div>
            <h2 className="text-2xl font-extrabold toast-ink mb-1">Locked in {HAND[pending[meId]]}</h2>
            <div className="flex items-center gap-2.5 mt-3 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-[rgba(16,24,40,.05)] shadow-sm">
              <span className="text-sm font-medium toast-muted">{oppName} is throwing</span>
              <TypingDots />
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
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-col items-center mb-7">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm mb-4 border border-[rgba(16,24,40,.06)] animate-float overflow-hidden">
                <Avatar pic={oppPic} name={oppName} className="w-full h-full rounded-full" />
              </div>
              <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-[rgba(16,24,40,.06)] shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="toast-ink font-bold text-sm">vs {oppName}</span>
              </div>
            </div>
            <h2 className="text-2xl font-extrabold toast-ink mb-1">Make your move</h2>
            <p className="toast-muted text-sm mb-1" data-testid="text-rps-explainer">
              {locale === "th"
                ? "เกมเป่ายิ้งฉุบ — ค้อน กระดาษ กรรไกร"
                : "It's a rock-paper-scissors match — rock, paper, scissors."}
            </p>
            <p className="toast-muted text-sm mb-7">
              {locale === "th"
                ? "ชนะ 2 ใน 3 — ผู้ชนะเลือกร้าน"
                : "Best of 3 — winner picks the table's spot."}
            </p>
            <div className="grid grid-cols-3 gap-3 w-full">
              {MOVES.map((m) => (
                <button
                  key={m}
                  onClick={() => !moveSubmitting && onMove(m)}
                  disabled={moveSubmitting}
                  data-testid={`button-move-${m}`}
                  className="group toast-card aspect-square flex flex-col items-center justify-center gap-2 active:scale-95 hover:-translate-y-1 hover:shadow-[0_16px_30px_-16px_rgba(255,204,2,0.6)] transition-all disabled:opacity-60"
                >
                  <span className="text-5xl transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6">{HAND[m]}</span>
                  <span className="font-bold text-[13px] toast-ink">{m.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Scoreboard({
  myScore,
  oppScore,
  roundNum,
  meId,
  oppId,
  AvatarBubble,
}: {
  myScore: number;
  oppScore: number;
  roundNum: number;
  meId: string;
  oppId: string;
  AvatarBubble: (props: { id: string; gold?: boolean }) => JSX.Element;
}) {
  return (
    <div className="pt-12 pb-3 px-6 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AvatarBubble id={meId} gold />
          <ScorePips score={myScore} gold />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#FFCC02] uppercase flex items-center gap-1">
            <Swords className="w-3 h-3" strokeWidth={2.5} /> Round {roundNum}
          </span>
          <span className="toast-ink font-extrabold text-lg leading-tight">
            {myScore} – {oppScore}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ScorePips score={oppScore} />
          <AvatarBubble id={oppId} />
        </div>
      </div>
      <p className="text-center text-[12px] font-medium toast-muted mt-2">First to {WINS_NEEDED} wins</p>
    </div>
  );
}
