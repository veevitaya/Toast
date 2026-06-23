import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Check, Loader2, Swords, Star, Crown } from "lucide-react";
import type { GroupTieBreaker } from "@shared/schema";
import {
  Avatar,
  Shell,
  memberName,
  memberPic,
  toDisplayItem,
  type DisplayItem,
  type SwipeMode,
  type TieBreakerMember,
  type TieBreakerPayload,
} from "./shared";
import { DuelView } from "./DuelView";
import { FryView } from "./FryView";
import tiebreakerVsImg from "@/assets/tiebreaker-vs.png";
import tiebreakerFryImg from "@/assets/tiebreaker-fry.png";

export type GroupTieBreakerGameProps = {
  sessionCode: string;
  meId: string;
  isHost: boolean;
  onComplete: (finalItemId: number, swipeType: string) => void;
};

export function GroupTieBreakerGame({ sessionCode, meId, isHost, onComplete }: GroupTieBreakerGameProps) {
  const queryKey = useMemo(
    () => ["/api/group/sessions", sessionCode, "tiebreaker"] as const,
    [sessionCode],
  );

  const { data } = useQuery<TieBreakerPayload>({
    queryKey,
    refetchInterval: 1500,
    staleTime: 0,
  });

  const tb = data?.tieBreaker || null;
  const items = data?.items || [];
  const members = data?.members || [];
  const swipeType: SwipeMode = (tb?.swipeType as SwipeMode) || "restaurant";

  const setData = (payload: TieBreakerPayload) => queryClient.setQueryData(queryKey, payload);

  const championMut = useMutation({
    mutationFn: async (itemId: number) =>
      (await apiRequest("POST", `/api/group/sessions/${sessionCode}/tiebreaker/champion`, { lineUserId: meId, itemId })).json(),
    onSuccess: (payload: TieBreakerPayload) => setData(payload),
  });
  const moveMut = useMutation({
    mutationFn: async ({ move, round }: { move: string; round: number }) =>
      (await apiRequest("POST", `/api/group/sessions/${sessionCode}/tiebreaker/move`, { lineUserId: meId, move, round })).json(),
    onSuccess: (payload: TieBreakerPayload) => setData(payload),
  });
  const fryMut = useMutation({
    mutationFn: async (fryId: string) =>
      (await apiRequest("POST", `/api/group/sessions/${sessionCode}/tiebreaker/fry`, { lineUserId: meId, fryId })).json(),
    onSuccess: (payload: TieBreakerPayload) => setData(payload),
  });
  const finishMut = useMutation({
    mutationFn: async (force?: boolean) =>
      (await apiRequest("POST", `/api/group/sessions/${sessionCode}/tiebreaker/finish`, { lineUserId: meId, force: !!force })).json(),
    onSuccess: (payload: TieBreakerPayload) => setData(payload),
  });

  // fire onComplete exactly once when the host finalizes
  const completedRef = useRef(false);
  useEffect(() => {
    if (!completedRef.current && tb?.status === "finished" && tb.finalItemId != null) {
      completedRef.current = true;
      onComplete(tb.finalItemId, tb.swipeType);
    }
  }, [tb?.status, tb?.finalItemId, tb?.swipeType, onComplete]);

  // Splash intro shown once at the start of a fresh tie-breaker. Late joiners (who land
  // mid-game) skip it. Auto-dismisses after a beat, or on tap.
  const [showIntro, setShowIntro] = useState(true);
  useEffect(() => {
    if (!tb) return;
    if (tb.status !== "choosing") { setShowIntro(false); return; }
    const t = setTimeout(() => setShowIntro(false), 3400);
    return () => clearTimeout(t);
  }, [tb?.status]);

  const displayItems = useMemo(() => items.map((it) => toDisplayItem(it, swipeType)), [items, swipeType]);
  const itemById = useMemo(() => {
    const m = new Map<number, DisplayItem>();
    displayItems.forEach((d) => m.set(d.id, d));
    return m;
  }, [displayItems]);

  if (!tb) {
    return (
      <Shell>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
          <Loader2 className="w-8 h-8 animate-spin toast-muted" />
          <p className="toast-muted mt-4 font-semibold">Setting up the tie-breaker…</p>
        </div>
      </Shell>
    );
  }

  if (showIntro) {
    return (
      <Shell>
        <IntroSplash gameType={tb.gameType} onContinue={() => setShowIntro(false)} />
      </Shell>
    );
  }

  if (tb.status === "choosing") {
    return (
      <Shell>
        <ChampionPicker
          tb={tb}
          displayItems={displayItems}
          members={members}
          meId={meId}
          isHost={isHost}
          swipeType={swipeType}
          submitting={championMut.isPending}
          onPick={(itemId) => championMut.mutate(itemId)}
          onForceFinish={() => finishMut.mutate(true)}
          finishing={finishMut.isPending}
        />
      </Shell>
    );
  }

  if (tb.gameType === "rps") {
    return (
      <Shell>
        <DuelView
          tb={tb}
          itemById={itemById}
          members={members}
          meId={meId}
          isHost={isHost}
          swipeType={swipeType}
          onMove={(m) => moveMut.mutate({ move: m, round: (((tb.gameState as any)?.rounds || []) as any[]).length })}
          moveSubmitting={moveMut.isPending}
          onFinish={() => finishMut.mutate(false)}
          onForceFinish={() => finishMut.mutate(true)}
          finishing={finishMut.isPending}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      <FryView
        tb={tb}
        itemById={itemById}
        members={members}
        meId={meId}
        isHost={isHost}
        onPick={(fryId) => fryMut.mutate(fryId)}
        pickSubmitting={fryMut.isPending}
        pickError={(fryMut.error as Error)?.message || null}
        onFinish={() => finishMut.mutate(false)}
        onForceFinish={() => finishMut.mutate(true)}
        finishing={finishMut.isPending}
      />
    </Shell>
  );
}

function IntroSplash({ gameType, onContinue }: { gameType: string; onContinue: () => void }) {
  const isRps = gameType === "rps";
  const img = isRps ? tiebreakerVsImg : tiebreakerFryImg;
  return (
    <div
      className="relative z-10 flex flex-col flex-1 items-center justify-center px-6 text-center"
      data-testid="tiebreaker-intro"
      onClick={onContinue}
    >
      <div className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-4 py-1.5 rounded-full mb-6 animate-pop-in">
        <Swords className="w-3.5 h-3.5 text-[#FFCC02]" strokeWidth={2.5} />
        <span className="text-[12px] font-bold tracking-wide">{isRps ? "RPS DUEL" : "LONGEST FRY"}</span>
      </div>
      <img
        src={img}
        alt={isRps ? "Toast versus Waffle" : "Longest fry wins"}
        className="w-full max-w-[300px] object-contain mb-7 animate-scale-pop"
        style={{ filter: "drop-shadow(0 18px 26px rgba(0,0,0,0.18))" }}
      />
      <h1 className="text-[32px] font-extrabold toast-ink leading-tight">Can't decide?</h1>
      <p className="text-[17px] font-semibold toast-muted mt-2">Let's settle this! {isRps ? "🥊" : "🍟"}</p>
      <button
        onClick={onContinue}
        data-testid="button-intro-continue"
        className="mt-8 toast-gold px-8 py-3.5 rounded-2xl font-bold text-[16px] shadow-[0_8px_20px_-6px_rgba(255,204,2,0.4)] active:scale-95 transition-transform"
      >
        {isRps ? "Bring it on" : "Let's pull"}
      </button>
    </div>
  );
}

function ChampionPicker({
  tb,
  displayItems,
  members,
  meId,
  isHost,
  swipeType,
  submitting,
  onPick,
  onForceFinish,
  finishing,
}: {
  tb: GroupTieBreaker;
  displayItems: DisplayItem[];
  members: TieBreakerMember[];
  meId: string;
  isHost: boolean;
  swipeType: SwipeMode;
  submitting: boolean;
  onPick: (itemId: number) => void;
  onForceFinish: () => void;
  finishing: boolean;
}) {
  const champions = (tb.champions || {}) as Record<string, number>;
  const myChampion = champions[meId];
  const iPicked = myChampion != null;
  const participants = tb.participantIds || [];
  const pickedCount = participants.filter((p) => champions[p] != null).length;
  const isDuel = tb.gameType === "rps";
  const noun = swipeType === "menu" ? "dishes" : "spots";
  const [selected, setSelected] = useState<number | null>(displayItems[0]?.id ?? null);

  if (iPicked) {
    const mine = displayItems.find((d) => d.id === myChampion);
    return (
      <div className="relative z-10 flex flex-col flex-1 px-6">
        <div className="pt-14 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FFCC02]/20 px-4 py-1.5 rounded-full mb-4">
            <Check className="w-4 h-4 text-[#0F172A]" strokeWidth={3} />
            <span className="text-[13px] font-bold toast-ink">You're backing {mine?.name}</span>
          </div>
          <h1 className="text-2xl font-extrabold toast-ink">Waiting for the table</h1>
          <p className="toast-muted text-[15px] mt-1">
            {isDuel ? "Then it's a Rock-Paper-Scissors duel." : "Then the Longest Fry decides."}
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="toast-card w-full p-5">
            <p className="text-[12px] font-bold tracking-wide toast-muted uppercase mb-3">
              {pickedCount}/{participants.length} locked in
            </p>
            <div className="space-y-3">
              {participants.map((uid) => {
                const ready = champions[uid] != null;
                return (
                  <div key={uid} className="flex items-center gap-3" data-testid={`row-champion-${uid}`}>
                    <div className="toast-avatar w-9 h-9 text-base border-2 border-white">
                      <Avatar pic={memberPic(members, uid)} name={memberName(members, uid, meId)} className="w-full h-full rounded-full" />
                    </div>
                    <span className="flex-1 font-bold text-sm toast-ink">{memberName(members, uid, meId)}</span>
                    {ready ? (
                      <span className="flex items-center gap-1 text-green-600 text-[13px] font-bold">
                        <Check className="w-4 h-4" strokeWidth={3} /> Ready
                      </span>
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin toast-muted" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {isHost && pickedCount < participants.length && (
            <button
              onClick={onForceFinish}
              disabled={finishing}
              data-testid="button-tiebreaker-force"
              className="mt-6 text-[13px] font-semibold text-slate-400 underline underline-offset-2 disabled:opacity-50"
            >
              {finishing ? "Deciding…" : "Someone's away? Decide it now"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col flex-1">
      <div className="pt-14 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-4 py-1.5 rounded-full mb-4">
          <Swords className="w-3.5 h-3.5 text-[#FFCC02]" strokeWidth={2.5} />
          <span className="text-[12px] font-bold tracking-wide">{isDuel ? "RPS DUEL" : "LONGEST FRY"}</span>
        </div>
        <h1 className="text-[28px] font-extrabold toast-ink leading-tight">
          {displayItems.length} {noun}, one table
        </h1>
        <p className="toast-muted text-[15px] mt-2">
          Back your favorite — {isDuel ? "then duel for it." : "then pull for it."}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
        {displayItems.map((item) => {
          const active = selected === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              data-testid={`button-champion-${item.id}`}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                active
                  ? "bg-white shadow-[0_12px_28px_-14px_rgba(255,204,2,0.9)] ring-2 ring-[#FFCC02]"
                  : "bg-white/70 border border-black/[0.05] hover:bg-white"
              }`}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">{item.emoji}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold toast-ink truncate">{item.name}</p>
                <p className="text-[13px] toast-muted truncate">
                  {swipeType === "menu" && item.place ? item.place : item.sub}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5 text-[12px] font-bold text-green-600">
                    <Star className="w-3 h-3 fill-current" /> {item.rating}
                  </span>
                  <span className="text-[12px] font-semibold text-slate-400">{item.price}</span>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  active ? "bg-[#FFCC02]" : "border-2 border-slate-200"
                }`}
              >
                {active && <Check className="w-4 h-4 text-[#0F172A]" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-6 pb-8 pt-2 bg-gradient-to-t from-[#FAF6EF] via-[#FAF6EF] to-transparent">
        <button
          onClick={() => selected != null && onPick(selected)}
          disabled={selected == null || submitting}
          data-testid="button-lock-champion"
          className="w-full toast-gold py-4 rounded-2xl font-bold text-[17px] shadow-[0_8px_20px_-6px_rgba(255,204,2,0.4)] transform active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crown className="w-5 h-5" strokeWidth={2.5} />}
          Lock in my champion
        </button>
      </div>
    </div>
  );
}
