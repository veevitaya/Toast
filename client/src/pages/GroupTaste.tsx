import { useState, useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Sparkles, Utensils, Wallet, Leaf, ArrowRight, Share2, Flame } from "lucide-react";
import { sendGroupInviteNoRedirect } from "@/lib/liff";

const GOLD = "#FFCC02";
const BG = "hsl(30, 20%, 97%)";
const BG_FADE = "hsla(30, 20%, 97%, 0)";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

const STAGES = ["Plan", "Taste", "Swipe", "Match", "Eat"];

const MOODS = [
  { label: "Comfort", emoji: "🍲" },
  { label: "Adventurous", emoji: "🌏" },
  { label: "Light", emoji: "🥗" },
  { label: "Indulgent", emoji: "🤤" },
  { label: "Cozy", emoji: "🫕" },
  { label: "Fresh", emoji: "🥬" },
];
const CUISINE_OPTS = [
  { label: "Thai", emoji: "🇹🇭" },
  { label: "Japanese", emoji: "🍣" },
  { label: "Korean", emoji: "🍜" },
  { label: "Italian", emoji: "🍕" },
  { label: "Chinese", emoji: "🥡" },
  { label: "Indian", emoji: "🍛" },
  { label: "Mexican", emoji: "🌮" },
  { label: "Seafood", emoji: "🦐" },
  { label: "BBQ", emoji: "🍖" },
  { label: "Desserts", emoji: "🍰" },
  { label: "Café", emoji: "☕" },
  { label: "Street food", emoji: "🍢" },
];
const DIET_OPTS = [
  { label: "Veg option", emoji: "🥗" },
  { label: "Vegan", emoji: "🌱" },
  { label: "Halal", emoji: "☪️" },
  { label: "No pork", emoji: "🐷" },
  { label: "No beef", emoji: "🐄" },
  { label: "No nuts", emoji: "🥜" },
  { label: "Gluten-free", emoji: "🌾" },
];
const SPICE_OPTS = [
  { label: "Mild", emoji: "🌱" },
  { label: "Medium", emoji: "🌶️" },
  { label: "Hot", emoji: "🔥" },
];

export default function GroupTaste() {
  const [, navigate] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hostOfSession, setHostOfSession] = useState(() => {
    try {
      const sid = new URLSearchParams(window.location.search).get("session");
      return !!sid && sessionStorage.getItem("toast_group_host_session") === sid;
    } catch {
      return false;
    }
  });

  const [mood, setMood] = useState<string>("");
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(-1);
  const [diet, setDiet] = useState<string[]>([]);
  const [spice, setSpice] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session");
    if (!sid) {
      navigate("/group/setup");
      return;
    }
    setSessionId(sid);
  }, [navigate]);

  const toggle = (val: string, list: string[], setter: (v: string[]) => void) =>
    setter(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  const persistTaste = () => {
    try {
      sessionStorage.setItem(
        "toast_group_taste",
        JSON.stringify({
          mood: mood || null,
          cuisines,
          budget: budget >= 0 ? budget : null,
          diet,
          spice: spice || null,
        }),
      );
    } catch {}
  };

  const handleReady = () => {
    if (!sessionId) return;
    persistTaste();
    navigate(`/group/waiting?session=${sessionId}`);
  };

  const handleHostInvite = async () => {
    if (!sessionId) return;
    persistTaste();
    try {
      await sendGroupInviteNoRedirect(sessionId);
    } catch {}
    navigate(`/group/waiting?session=${sessionId}`);
  };

  if (!sessionId) return null;

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col bg-background"
      style={{ color: INK }}
      data-testid="group-taste-page"
    >
      <header className="px-6 pt-14 pb-2">
        <div className="flex items-center justify-between">
          {hostOfSession ? (
            <button
              aria-label="Go back"
              data-testid="button-back"
              onClick={() => navigate("/group/setup")}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <span className="w-10 h-10" aria-hidden="true" />
          )}
          <span className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
            Group session
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-4" data-testid="stepper">
          {STAGES.map((label, i) => {
            const active = i === 1;
            const done = i < 1;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full h-1.5 rounded-full"
                  style={{ backgroundColor: active || done ? GOLD : "rgba(26,26,26,0.1)", opacity: done ? 0.5 : 1 }}
                />
                <span className="text-[10px] font-semibold tracking-wide" style={{ color: active ? INK : MUTE, opacity: active ? 1 : 0.7 }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </header>

      <main className="flex-1 px-6 pb-44 pt-4">
        <h1 className="text-[27px] font-bold tracking-tight leading-tight">
          Your taste, your call
        </h1>
        <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
          {hostOfSession
            ? "Set yours first, then invite your crew. Toast overlaps everyone to find dishes that fit the whole table."
            : "Each person sets their own. Toast overlaps everyone to find dishes that fit the whole table."}
        </p>

        <Section icon={<Sparkles className="w-4 h-4" />} title="Mood">
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <Chip key={m.label} testid={`mood-${m.label}`} active={mood === m.label} onClick={() => setMood(m.label)}>
                <span className="text-[16px] leading-none mr-1.5">{m.emoji}</span>{m.label}
              </Chip>
            ))}
          </div>
        </Section>

        <Section icon={<Utensils className="w-4 h-4" />} title="Cuisines" hint="pick any">
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTS.map((c) => (
              <Chip key={c.label} testid={`cuisine-${c.label}`} active={cuisines.includes(c.label)} onClick={() => toggle(c.label, cuisines, setCuisines)}>
                <span className="text-[16px] leading-none mr-1.5">{c.emoji}</span>{c.label}
              </Chip>
            ))}
          </div>
        </Section>

        <Section icon={<Wallet className="w-4 h-4" />} title="Budget">
          <div className="flex gap-2">
            {["\u0E3F", "\u0E3F\u0E3F", "\u0E3F\u0E3F\u0E3F"].map((b, i) => (
              <button
                key={b}
                data-testid={`budget-${i}`}
                onClick={() => setBudget(i)}
                aria-pressed={budget === i}
                className="flex-1 h-12 rounded-2xl text-[16px] font-bold border transition-all active:scale-[0.98]"
                style={budget === i ? { backgroundColor: GOLD, color: INK, borderColor: GOLD } : { backgroundColor: "#fff", color: MUTE, borderColor: "rgba(26,26,26,0.12)" }}
              >
                {b}
              </button>
            ))}
          </div>
        </Section>

        <Section icon={<Flame className="w-4 h-4" />} title="Spice level">
          <div className="flex gap-2">
            {SPICE_OPTS.map((s) => (
              <button
                key={s.label}
                data-testid={`spice-${s.label}`}
                onClick={() => setSpice(s.label)}
                aria-pressed={spice === s.label}
                className="flex-1 h-12 rounded-2xl text-[14px] font-bold border transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                style={spice === s.label ? { backgroundColor: GOLD, color: INK, borderColor: GOLD } : { backgroundColor: "#fff", color: MUTE, borderColor: "rgba(26,26,26,0.12)" }}
              >
                <span className="text-[16px] leading-none">{s.emoji}</span>{s.label}
              </button>
            ))}
          </div>
        </Section>

        <Section icon={<Leaf className="w-4 h-4" />} title="Restrictions" hint="optional">
          <div className="flex flex-wrap gap-2">
            {DIET_OPTS.map((d) => (
              <Chip key={d.label} testid={`diet-${d.label}`} active={diet.includes(d.label)} onClick={() => toggle(d.label, diet, setDiet)}>
                <span className="text-[16px] leading-none mr-1.5">{d.emoji}</span>{d.label}
              </Chip>
            ))}
          </div>
        </Section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10" style={{ background: `linear-gradient(to top, ${BG} 78%, ${BG_FADE})` }}>
        {hostOfSession ? (
          <button
            data-testid="button-invite"
            onClick={handleHostInvite}
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: LINE, color: "#fff", boxShadow: "0 8px 20px -8px rgba(6,199,85,0.5)" }}
          >
            <Share2 className="w-5 h-5" /> Invite your crew
          </button>
        ) : (
          <button
            data-testid="button-ready"
            onClick={handleReady}
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 8px 20px -8px rgba(255,204,2,0.55)" }}
          >
            I&apos;m ready <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function Section({ icon, title, hint, children }: { icon: ReactNode; title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-2.5">
        <span style={{ color: GOLD }}>{icon}</span>
        <span className="text-[15px] font-bold">{title}</span>
        {hint && <span className="text-[12px]" style={{ color: MUTE }}>· {hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Chip({ children, active, onClick, testid }: { children: ReactNode; active: boolean; onClick: () => void; testid: string }) {
  return (
    <button
      data-testid={testid}
      onClick={onClick}
      aria-pressed={active}
      className="px-4 py-2 rounded-full text-[14px] font-semibold border transition-all active:scale-[0.97]"
      style={active ? { backgroundColor: INK, color: "#fff", borderColor: INK } : { backgroundColor: "#fff", color: INK, borderColor: "rgba(26,26,26,0.12)" }}
    >
      {children}
    </button>
  );
}
