import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, RotateCcw, Play } from "lucide-react";
import { Shell } from "@/components/group-tiebreaker/shared";
import type { DisplayItem, TieBreakerMember } from "@/components/group-tiebreaker/shared";
import { FryView } from "@/components/group-tiebreaker/FryView";
import type { GroupTieBreaker } from "@shared/schema";

// Reveal-only preview for the "Longest Fry" tie-breaker. It mounts the REAL resolved
// FryView (same code path the live game uses) with mock data, so the climbing reveal
// → crown → destination plays instantly without a backend session or a second phone.
// Replayable, with preset draws so the zoomed measuring window is easy to judge.

const cmToLen = (cm: number) => (cm - 7) / 9; // inverse of lenToCm in FryView
const FINAL_ITEM_ID = 9001;
const ME = "you";

type Racer = { id: string; name: string; cm: number };
type Scenario = { key: string; title: string; blurb: string; racers: Racer[] };

const SCENARIOS: Scenario[] = [
  {
    key: "clustered",
    title: "Clustered pull",
    blurb: "Three fries within ~0.3 cm (10.1 / 10.3 / 10.4) — the case your clip hit.",
    racers: [
      { id: ME, name: "You", cm: 10.4 },
      { id: "bonnie", name: "Bonnie", cm: 10.1 },
      { id: "cleo", name: "Cleo", cm: 10.3 },
    ],
  },
  {
    key: "wide",
    title: "Wide spread",
    blurb: "Lengths far apart (9.6 / 12.8 / 15.4) — a clear runaway winner.",
    racers: [
      { id: ME, name: "You", cm: 9.6 },
      { id: "bonnie", name: "Bonnie", cm: 12.8 },
      { id: "cleo", name: "Cleo", cm: 15.4 },
    ],
  },
  {
    key: "photo",
    title: "Photo finish (2 players)",
    blurb: "Two fries almost identical (11.2 / 11.0) — the closest possible race.",
    racers: [
      { id: ME, name: "You", cm: 11.2 },
      { id: "bonnie", name: "Bonnie", cm: 11.0 },
    ],
  },
  {
    key: "group",
    title: "Big group (5 players)",
    blurb: "Five fries across the carton (winner is a bot) — crowned from the pack.",
    racers: [
      { id: ME, name: "You", cm: 12.0 },
      { id: "bonnie", name: "Bonnie", cm: 9.8 },
      { id: "cleo", name: "Cleo", cm: 13.6 },
      { id: "dao", name: "Dao", cm: 11.1 },
      { id: "finn", name: "Finn", cm: 15.1 },
    ],
  },
];

function buildMock(sc: Scenario) {
  const winner = sc.racers.reduce((a, b) => (b.cm > a.cm ? b : a));
  const carton = sc.racers.map((r, i) => ({
    id: `fry_${r.id}`,
    poke: cmToLen(r.cm),
    trueLen: cmToLen(r.cm),
    lean: 0,
    w: 14,
    tone: 0.5,
    seed: i + 1,
  }));
  const picks: Record<string, string> = {};
  sc.racers.forEach((r) => {
    picks[r.id] = `fry_${r.id}`;
  });

  const tb = {
    id: 1,
    sessionCode: "preview",
    gameType: "fry",
    swipeType: "restaurant",
    status: "resolved",
    participantIds: sc.racers.map((r) => r.id),
    matchItemIds: [FINAL_ITEM_ID],
    champions: {},
    gameState: { carton, picks },
    winnerLineUserId: winner.id,
    finalItemId: FINAL_ITEM_ID,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as GroupTieBreaker;

  const members: TieBreakerMember[] = sc.racers.map((r) => ({
    lineUserId: r.id,
    displayName: r.name,
    pictureUrl: null,
  }));

  const item: DisplayItem = {
    id: FINAL_ITEM_ID,
    name: "Err Urban Rustic Thai",
    sub: "Thai • Rustic",
    place: "Err Urban Rustic Thai",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop&q=60",
    rating: "4.7",
    area: "Phra Nakhon",
    price: "฿฿",
    emoji: "🍛",
    cuisine: "Rustic Thai comfort food, charcoal-grilled",
  };
  const itemById = new Map<number, DisplayItem>([[FINAL_ITEM_ID, item]]);

  return { tb, members, itemById };
}

function initialScenarioKey(): string | null {
  if (typeof window === "undefined") return null;
  const k = new URLSearchParams(window.location.search).get("s");
  return SCENARIOS.some((s) => s.key === k) ? k : null;
}

export default function FryRevealPreview() {
  const [, navigate] = useLocation();
  const [scKey, setScKey] = useState<string | null>(initialScenarioKey);
  const [runId, setRunId] = useState(0);

  const scenario = SCENARIOS.find((s) => s.key === scKey) || null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mock = useMemo(() => (scenario ? buildMock(scenario) : null), [scKey, runId]);

  if (scenario && mock) {
    return (
      <div className="relative">
        <Shell testId="fry-reveal-preview">
          <FryView
            key={`${scenario.key}-${runId}`}
            tb={mock.tb}
            itemById={mock.itemById}
            members={mock.members}
            meId={ME}
            isHost
            onPick={() => {}}
            pickSubmitting={false}
            pickError={null}
            onFinish={() => setScKey(null)}
            onForceFinish={() => {}}
            finishing={false}
          />
        </Shell>

        {/* floating controls layered above the reveal (z-[60]), constrained to the
            phone column so they sit in the corners of the stage, clear of the
            centered banner */}
        <div className="fixed inset-x-0 top-0 z-[80] pointer-events-none">
          <div className="mx-auto flex max-w-[430px] items-center justify-between px-3 pt-[max(env(safe-area-inset-top),0.6rem)]">
            <button
              onClick={() => {
                setScKey(null);
                navigate("/group/fry-reveal-preview");
              }}
              data-testid="button-preview-back"
              className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-bold text-white/90 backdrop-blur active:opacity-70"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Scenarios
            </button>
            <button
              onClick={() => setRunId((n) => n + 1)}
              data-testid="button-preview-replay"
              className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-[#FFCC02] px-3 py-1.5 text-[12px] font-extrabold text-[#0B1325] active:opacity-80"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Replay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="toast-tiebreaker flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#FAF6EF] px-6 py-12">
      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate("/")}
          data-testid="button-preview-home"
          className="mb-8 flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 active:opacity-70"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </button>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-4 py-1.5 text-white">
          <span className="text-lg leading-none">🍟</span>
          <span className="text-[12px] font-bold tracking-wide">LONGEST FRY · REVEAL PREVIEW</span>
        </div>
        <h1 className="text-[28px] font-extrabold leading-tight text-[#0F172A]">See the reveal instantly</h1>
        <p className="mb-8 mt-2 text-[15px] text-slate-500">
          No session, no second phone — pick a draw and watch the fries climb, freeze, and crown the longest. Tap
          Replay any time.
        </p>

        <div className="space-y-3">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.key}
              onClick={() => {
                setScKey(sc.key);
                setRunId((n) => n + 1);
                navigate(`/group/fry-reveal-preview?s=${sc.key}`);
              }}
              data-testid={`button-scenario-${sc.key}`}
              className="toast-card flex w-full items-center gap-4 p-5 text-left transition-transform active:scale-[0.98] hover:shadow-[0_16px_30px_-16px_rgba(255,204,2,0.6)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFCC02]">
                <Play className="h-5 w-5 fill-[#0F172A] text-[#0F172A]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-[#0F172A]">{sc.title}</p>
                <p className="text-[13px] text-slate-500">{sc.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
