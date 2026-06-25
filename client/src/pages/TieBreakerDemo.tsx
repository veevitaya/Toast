import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Swords, Loader2, ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { GroupTieBreakerGame } from "@/components/group-tiebreaker/GroupTieBreakerGame";

// Real restaurant ids that exist in the seed data (used by the backend smoke test).
const MATCH_ITEM_IDS = [30, 36, 49];
const SWIPE_TYPE = "restaurant";
const RPS_MOVES = ["rock", "paper", "scissors"] as const;

type DemoMode = "rps" | "fry";

type Bot = { id: string; name: string };

function rand() {
  return Math.random().toString(36).slice(2, 8);
}

async function post(url: string, body: unknown) {
  return (await apiRequest("POST", url, body)).json();
}

export default function TieBreakerDemo() {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<"intro" | "loading" | "playing" | "done">("intro");
  const [sessionCode, setSessionCode] = useState("");
  const [meId, setMeId] = useState("");
  const [mode, setMode] = useState<DemoMode>("rps");
  const [error, setError] = useState<string | null>(null);

  const botsRef = useRef<Bot[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopBots = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopBots(), [stopBots]);

  // Background loop that plays every bot opponent against the real backend, so a single
  // browser can experience the full multiplayer flow. The game component self-polls every
  // 1.5s, so we only need to drive the bots here.
  const startBots = useCallback((code: string) => {
    stopBots();
    pollRef.current = setInterval(async () => {
      try {
        const data = await (await apiRequest("GET", `/api/group/sessions/${code}/tiebreaker`)).json();
        const tb = data?.tieBreaker;
        if (!tb || tb.status === "finished" || tb.status === "resolved") return;
        const gs = tb.gameState || {};
        const champions = (tb.champions || {}) as Record<string, number>;
        const bots = botsRef.current;

        for (let i = 0; i < bots.length; i++) {
          const bot = bots[i];
          if (tb.status === "choosing") {
            if (champions[bot.id] == null) {
              const itemId = MATCH_ITEM_IDS[(i + 1) % MATCH_ITEM_IDS.length];
              await post(`/api/group/sessions/${code}/tiebreaker/champion`, { lineUserId: bot.id, itemId }).catch(() => {});
            }
            continue;
          }
          if (tb.status === "playing" && tb.gameType === "rps") {
            const pending = (gs.pendingMoves || {}) as Record<string, string>;
            if (pending[bot.id] == null) {
              const move = RPS_MOVES[Math.floor(Math.random() * 3)];
              const round = (Array.isArray(gs.rounds) ? gs.rounds.length : 0);
              await post(`/api/group/sessions/${code}/tiebreaker/move`, { lineUserId: bot.id, move, round }).catch(() => {});
            }
            continue;
          }
          if (tb.status === "playing" && tb.gameType === "fry") {
            const picks = (gs.picks || {}) as Record<string, string>;
            const carton = (gs.carton || []) as Array<{ id: string }>;
            if (picks[bot.id] == null && carton.length) {
              const taken = new Set(Object.values(picks));
              const free = carton.find((f) => !taken.has(f.id));
              if (free) await post(`/api/group/sessions/${code}/tiebreaker/fry`, { lineUserId: bot.id, fryId: free.id }).catch(() => {});
            }
          }
        }
      } catch {
        /* transient poll error — try again next tick */
      }
    }, 850);
  }, [stopBots]);

  const launch = useCallback(async (demoMode: DemoMode) => {
    setMode(demoMode);
    setPhase("loading");
    setError(null);
    try {
      const you = `you_${rand()}`;
      const bots: Bot[] = demoMode === "rps"
        ? [{ id: `bot_${rand()}`, name: "Bonnie" }]
        : [{ id: `bot_${rand()}`, name: "Bonnie" }, { id: `bot_${rand()}`, name: "Cleo" }];
      botsRef.current = bots;
      const everyone = [{ id: you, name: "You" }, ...bots];

      // 1. create the session (host is auto-added as a member)
      const created = await post(`/api/group/sessions`, { hostLineUserId: you, hostDisplayName: "You" });
      const code = created.sessionCode as string;

      // 2. bots join
      for (const bot of bots) {
        await post(`/api/group/sessions/${code}/join`, { lineUserId: bot.id, displayName: bot.name });
      }

      // 3. mark swiping, then everyone swipes right on the same spots -> multiple full matches
      await post(`/api/group/sessions/${code}/status`, { status: "swiping", lineUserId: you });
      for (const itemId of MATCH_ITEM_IDS) {
        for (const person of everyone) {
          await post(`/api/group/sessions/${code}/swipe`, {
            lineUserId: person.id,
            menuItemId: itemId,
            direction: "right",
            swipeType: SWIPE_TYPE,
          });
        }
      }

      // 4. host starts the tie-breaker; seed the game's query cache for an instant render
      const started = await post(`/api/group/sessions/${code}/tiebreaker/start`, { lineUserId: you, swipeType: SWIPE_TYPE });
      queryClient.setQueryData(["/api/group/sessions", code, "tiebreaker"], started);

      setSessionCode(code);
      setMeId(you);
      setPhase("playing");
      startBots(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong setting up the demo.");
      setPhase("intro");
    }
  }, [startBots]);

  const handleComplete = useCallback(() => {
    stopBots();
    setPhase("done");
  }, [stopBots]);

  const reset = useCallback(() => {
    stopBots();
    setSessionCode("");
    setMeId("");
    setPhase("intro");
  }, [stopBots]);

  if (phase === "playing" && sessionCode && meId) {
    return (
      <GroupTieBreakerGame
        sessionCode={sessionCode}
        meId={meId}
        isHost
        onComplete={handleComplete}
      />
    );
  }

  return (
    <div className="toast-tiebreaker w-full min-h-[100dvh] bg-[#FAF6EF] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate("/")}
          data-testid="button-demo-home"
          className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 mb-8 active:opacity-70"
        >
          <ArrowLeft className="w-4 h-4" /> Back home
        </button>

        <div className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-4 py-1.5 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#FFCC02]" strokeWidth={2.5} />
          <span className="text-[12px] font-bold tracking-wide">TIE-BREAKER DEMO</span>
        </div>
        <h1 className="text-[28px] font-extrabold text-[#0F172A] leading-tight">See both mini-games</h1>
        <p className="text-slate-500 text-[15px] mt-2 mb-8">
          You'll be dropped into a real group with multiple matches. Back a spot, then the game decides — the
          other players are auto-played for you.
        </p>

        {phase === "loading" ? (
          <div className="toast-card w-full p-8 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-[#FFCC02]" />
            <p className="font-semibold text-slate-500 text-sm">Setting up your {mode === "rps" ? "duel" : "fry pull"}…</p>
          </div>
        ) : phase === "done" ? (
          <div className="toast-card w-full p-7 flex flex-col items-center text-center gap-4">
            <span className="text-4xl">🎉</span>
            <div>
              <p className="font-extrabold text-[#0F172A] text-lg">That's the flow!</p>
              <p className="text-slate-500 text-sm mt-1">The winner's spot becomes the group's final pick.</p>
            </div>
            <button
              onClick={reset}
              data-testid="button-demo-again"
              className="w-full toast-gold py-3.5 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <RotateCcw className="w-4 h-4" /> Try the other one
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-[13px] font-semibold text-red-600" data-testid="text-demo-error">
                {error}
              </div>
            )}
            <button
              onClick={() => launch("rps")}
              data-testid="button-demo-rps"
              className="w-full toast-card p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform hover:shadow-[0_16px_30px_-16px_rgba(255,204,2,0.6)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFCC02] flex items-center justify-center shrink-0">
                <Swords className="w-6 h-6 text-[#0F172A]" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-[#0F172A]">RPS Duel</p>
                <p className="text-[13px] text-slate-500">2 players · best of 3 · rock-paper-scissors</p>
              </div>
            </button>
            <button
              onClick={() => launch("fry")}
              data-testid="button-demo-fry"
              className="w-full toast-card p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform hover:shadow-[0_16px_30px_-16px_rgba(255,204,2,0.6)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0F172A] flex items-center justify-center shrink-0">
                <span className="text-2xl">🍟</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-[#0F172A]">Longest Fry</p>
                <p className="text-[13px] text-slate-500">3 players · pull a fry · longest wins</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/group/fry-reveal-preview")}
              data-testid="button-demo-fry-reveal"
              className="w-full text-center text-[13px] font-semibold text-slate-400 underline underline-offset-2 active:opacity-70 pt-1"
            >
              Just want the fry reveal? See it instantly →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
