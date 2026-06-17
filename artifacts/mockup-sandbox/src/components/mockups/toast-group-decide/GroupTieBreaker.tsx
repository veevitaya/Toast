import { useMemo, useState } from "react";
import {
  Soup,
  Utensils,
  Flame,
  Crown,
  Star,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Check,
  Hand,
  Swords,
} from "lucide-react";
import { PlayDuel, type DuelItem } from "../toast-rps-duel/PlayDuel";
import FryPull, { type Player } from "./FryPull";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#6B7280";

type Mode = "dish" | "restaurant";
type Screen = "decide" | "rps" | "fries" | "settled";

type Match = DuelItem & {
  id: string;
  Icon: React.ElementType;
  tint: string;
};

const DISH_MATCHES: Match[] = [
  {
    id: "khaosoi",
    name: "Khao Soi",
    sub: "Northern curry noodles",
    emoji: "🍜",
    img: "/__mockup/images/Winner-khaosoi.png",
    rating: "4.8",
    area: "Ekkamai",
    dist: "1.2 km",
    price: "฿฿",
    cuisine: "Authentic Northern Thai.",
    place: "Hom Duan",
    Icon: Soup,
    tint: "#FFF3CC",
  },
  {
    id: "greencurry",
    name: "Green Curry",
    sub: "Creamy & spicy",
    emoji: "🍛",
    img: "/__mockup/images/Winner-greencurry.png",
    rating: "4.7",
    area: "Phra Nakhon",
    dist: "2.4 km",
    price: "฿฿",
    cuisine: "Home-style Thai kitchen.",
    place: "Krua Apsorn",
    Icon: Utensils,
    tint: "#E8F1FB",
  },
  {
    id: "somtam",
    name: "Som Tam",
    sub: "Papaya salad",
    emoji: "🥗",
    img: "/__mockup/images/Winner-somtam.png",
    rating: "4.6",
    area: "Siam",
    dist: "0.8 km",
    price: "฿",
    cuisine: "Fiery Isaan favourites.",
    place: "Som Tam Nua",
    Icon: Flame,
    tint: "#FCEFD6",
  },
];

const RESTAURANT_MATCHES: Match[] = [
  {
    id: "homduan",
    name: "Hom Duan",
    sub: "Northern Thai · Ekkamai",
    emoji: "🍜",
    img: "/__mockup/images/Winner-khaosoi.png",
    rating: "4.8",
    area: "Ekkamai",
    dist: "1.2 km",
    price: "฿฿",
    cuisine: "Chiang Mai comfort food.",
    Icon: Soup,
    tint: "#FFF3CC",
  },
  {
    id: "kruaapsorn",
    name: "Krua Apsorn",
    sub: "Home-style Thai · Phra Nakhon",
    emoji: "🍛",
    img: "/__mockup/images/Winner-greencurry.png",
    rating: "4.7",
    area: "Phra Nakhon",
    dist: "2.4 km",
    price: "฿฿",
    cuisine: "A Bangkok institution.",
    Icon: Utensils,
    tint: "#E8F1FB",
  },
  {
    id: "somtamnua",
    name: "Som Tam Nua",
    sub: "Isaan · Siam",
    emoji: "🥗",
    img: "/__mockup/images/Winner-somtam.png",
    rating: "4.6",
    area: "Siam",
    dist: "0.8 km",
    price: "฿",
    cuisine: "Lines out the door for a reason.",
    Icon: Flame,
    tint: "#FCEFD6",
  },
];

const PEOPLE = [
  { id: "you", emoji: "😎", name: "You", initial: "Y", auto: false },
  { id: "mint", emoji: "👩🏻", name: "Mint", initial: "M", auto: true },
  { id: "boss", emoji: "🧑🏻‍🦱", name: "Boss", initial: "B", auto: true },
];

function joinNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

function Seg({
  value,
  options,
  onChange,
  testid,
}: {
  value: string;
  options: { label: string; val: string }[];
  onChange: (v: string) => void;
  testid: string;
}) {
  return (
    <div className="flex p-0.5 rounded-full" style={{ backgroundColor: "rgba(26,26,26,0.06)" }}>
      {options.map((o) => {
        const on = value === o.val;
        return (
          <button
            key={o.val}
            onClick={() => onChange(o.val)}
            data-testid={`${testid}-${o.val}`}
            className="px-3 py-1.5 rounded-full text-[12px] font-bold transition-all"
            style={{
              backgroundColor: on ? "#fff" : "transparent",
              color: on ? INK : MUTE,
              boxShadow: on ? "0 2px 6px -2px rgba(0,0,0,0.18)" : "none",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function GroupTieBreaker() {
  const [screen, setScreen] = useState<Screen>("decide");
  const [people, setPeople] = useState(2);
  const [multiple, setMultiple] = useState(true);
  const [mode, setMode] = useState<Mode>("dish");

  const matches = mode === "dish" ? DISH_MATCHES : RESTAURANT_MATCHES;
  const noun = mode === "dish" ? "dish" : "spot";
  const nounPlural = mode === "dish" ? "dishes" : "spots";
  const N = matches.length;

  const duelItems: DuelItem[] = useMemo(
    () => matches.map(({ id: _id, Icon: _Icon, tint: _tint, ...rest }) => rest),
    [matches],
  );

  const fryPlayers: Player[] = useMemo(
    () =>
      PEOPLE.map((p, i) => {
        const m = matches[i % matches.length];
        return {
          id: p.id,
          name: p.name,
          initial: p.initial,
          auto: p.auto,
          dish: { id: m.id, name: m.name, cuisine: m.area, price: m.price, Icon: m.Icon, tint: m.tint },
        };
      }),
    [matches],
  );

  if (screen === "rps") {
    return <PlayDuel items={duelItems} mode={mode} onBack={() => setScreen("decide")} />;
  }
  if (screen === "fries") {
    return <FryPull players={fryPlayers} mode={mode} onBack={() => setScreen("decide")} />;
  }

  const present = PEOPLE.slice(0, people);
  const namesText = joinNames(present.map((p) => p.name));
  const isDuel = people === 2;
  const winner = matches[0];

  // ----- SETTLED (single match → stop the session) -----
  if (screen === "settled") {
    return (
      <div
        className="max-w-[430px] mx-auto min-h-[844px] flex flex-col relative overflow-hidden"
        style={{ backgroundColor: CREAM, color: INK, fontFamily: "'Figtree', system-ui, sans-serif" }}
        data-testid="tiebreaker-settled"
      >
        <DemoBar
          people={people}
          multiple={multiple}
          mode={mode}
          setPeople={setPeople}
          setMultiple={setMultiple}
          setMode={setMode}
        />
        <header className="flex items-center justify-between px-6 pt-5 pb-2">
          <button
            onClick={() => setScreen("decide")}
            data-testid="button-settled-back"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-sm active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-[12px] font-bold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
            Group Session
          </span>
          <span className="w-10 h-10" />
        </header>

        <main className="flex-1 px-6 flex flex-col items-center text-center pt-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            <Check className="w-10 h-10" strokeWidth={2.5} />
          </div>
          <h1 className="text-[32px] font-extrabold tracking-tight leading-tight">It's unanimous!</h1>
          <p className="text-[15px] mt-3 leading-relaxed max-w-[300px]" style={{ color: MUTE }}>
            Everyone swiped right on the same {noun} on the first pass — no tie-breaker needed.
          </p>

          <div
            className="w-full mt-8 rounded-[24px] bg-white overflow-hidden text-left"
            style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}
            data-testid="settled-card"
          >
            <div className="relative h-[190px]">
              <img src={winner.img} alt={winner.name} className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="text-base">{winner.emoji}</span>
                <span className="font-bold text-[12px] tracking-wide">EVERYONE'S IN</span>
              </span>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-[24px] font-bold tracking-tight">
                  {mode === "dish" ? winner.place ?? winner.name : winner.name}
                </h2>
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-sm">{winner.rating}</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm mt-1">{winner.cuisine}</p>
              <div className="flex items-center gap-2.5 mt-5">
                <div className="flex -space-x-2">
                  {present.map((p) => (
                    <span
                      key={p.id}
                      className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm shadow-sm border border-black/[0.05]"
                    >
                      {p.emoji}
                    </span>
                  ))}
                </div>
                <span className="text-[13px] font-medium" style={{ color: MUTE }}>
                  {namesText} agreed
                </span>
              </div>
            </div>
          </div>
        </main>

        <div className="px-6 pt-4 pb-10">
          <button
            data-testid="button-end-session"
            className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 10px 24px -10px rgba(255,204,2,0.6)" }}
          >
            End session · let's eat
          </button>
        </div>
      </div>
    );
  }

  // ----- DECIDE (entry / router) -----
  const cta = !multiple
    ? { label: "End session · let's eat", icon: <Check className="w-5 h-5" />, go: () => setScreen("settled") }
    : isDuel
      ? { label: "Start the duel", icon: <Swords className="w-5 h-5" />, go: () => setScreen("rps") }
      : { label: "Pull for the winner", icon: <Hand className="w-5 h-5" />, go: () => setScreen("fries") };

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[844px] flex flex-col relative overflow-hidden"
      style={{ backgroundColor: CREAM, color: INK, fontFamily: "'Figtree', system-ui, sans-serif" }}
      data-testid="tiebreaker-decide"
    >
      <div aria-hidden className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full" style={{ background: "rgba(255,204,2,0.16)", filter: "blur(60px)" }} />

      <DemoBar
        people={people}
        multiple={multiple}
        mode={mode}
        setPeople={setPeople}
        setMultiple={setMultiple}
        setMode={setMode}
      />

      <div className="px-6 pt-5 flex items-center justify-between z-10">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            Group Session
          </p>
          <p className="text-[13px] font-semibold" style={{ color: MUTE }}>
            Thonglor · swiping wrapped
          </p>
        </div>
        <div className="flex -space-x-3">
          {present.map((p, i) => (
            <span
              key={p.id}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-[0_4px_10px_-4px_rgba(0,0,0,0.25)] border-2 border-white"
              style={{ zIndex: present.length - i }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      </div>

      <main className="flex-1 px-6 pt-6 z-10 flex flex-col">
        <h1 className="text-[30px] font-extrabold tracking-tight leading-[1.1]">
          {multiple ? (
            <>
              {N} matches,
              <br />
              one table.
            </>
          ) : (
            <>It's unanimous!</>
          )}
        </h1>
        <p className="text-[15px] mt-3 leading-relaxed" style={{ color: MUTE }}>
          {multiple ? (
            <>
              {namesText} kept swiping after the first match and racked up{" "}
              <span className="font-bold" style={{ color: INK }}>
                {N} {nounPlural}
              </span>{" "}
              you all liked. Time to crown just one.
            </>
          ) : (
            <>
              {namesText} all landed on the same {noun} without swiping any further. You're already
              agreed — no game needed.
            </>
          )}
        </p>

        {/* matched items */}
        <div className="mt-6 space-y-3">
          {(multiple ? matches : matches.slice(0, 1)).map((m) => (
            <div
              key={m.id}
              className="w-full bg-white rounded-[20px] p-3 flex items-center gap-3.5"
              style={{ boxShadow: "0 12px 28px -20px rgba(0,0,0,0.3)", border: "1px solid rgba(0,0,0,0.04)" }}
              data-testid={`match-${m.id}`}
            >
              <div className="relative w-16 h-16 shrink-0">
                <img src={m.img} alt={m.name} loading="lazy" className="w-full h-full object-cover rounded-2xl ring-1 ring-black/[0.06]" />
                <span className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white shadow-[0_2px_6px_rgba(16,24,40,0.18)] flex items-center justify-center text-base">
                  {m.emoji}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-[16px] leading-tight truncate">{m.name}</h3>
                <p className="text-[13px] truncate" style={{ color: MUTE }}>
                  {m.sub}
                </p>
                <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  {m.rating}
                  <span className="text-amber-300">·</span>
                  {m.area}
                </span>
              </div>
              <span
                className="flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{ backgroundColor: "rgba(255,204,2,0.16)", color: "#9A7A00" }}
              >
                <Sparkles className="w-3 h-3" />
                {people}/{people}
              </span>
            </div>
          ))}
        </div>

        {/* routing hint */}
        <div
          className="mt-6 flex items-center gap-3 rounded-[18px] p-3.5"
          style={{ backgroundColor: multiple ? "rgba(26,26,26,0.04)" : "rgba(6,199,85,0.08)" }}
          data-testid="routing-hint"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: multiple ? GOLD : "#06C755", color: multiple ? INK : "#fff" }}
          >
            {multiple ? (
              isDuel ? (
                <Swords className="w-5 h-5" />
              ) : (
                <Crown className="w-5 h-5" />
              )
            ) : (
              <Check className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[14px] leading-tight">
              {!multiple
                ? "Everyone agrees"
                : isDuel
                  ? "2 players → Rock-Paper-Scissors"
                  : `${people} players → Longest Fry`}
            </p>
            <p className="text-[12.5px] leading-tight" style={{ color: MUTE }}>
              {!multiple
                ? "No tie-breaker — just stop the session."
                : isDuel
                  ? "Best of 3. Winner picks which match wins."
                  : "Each backs a match — longest fry takes it."}
            </p>
          </div>
        </div>

        <div className="flex-1" />

        <button
          onClick={cta.go}
          data-testid="button-decide-cta"
          className="mt-6 mb-10 w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ backgroundColor: GOLD, color: INK, boxShadow: "0 10px 24px -10px rgba(255,204,2,0.6)" }}
        >
          {cta.icon}
          {cta.label}
          <ChevronRight className="w-5 h-5 -mr-1" />
        </button>
      </main>
    </div>
  );
}

function DemoBar({
  people,
  multiple,
  mode,
  setPeople,
  setMultiple,
  setMode,
}: {
  people: number;
  multiple: boolean;
  mode: Mode;
  setPeople: (n: number) => void;
  setMultiple: (b: boolean) => void;
  setMode: (m: Mode) => void;
}) {
  return (
    <div
      className="px-4 py-2.5 flex items-center gap-2 flex-wrap border-b"
      style={{ backgroundColor: "rgba(255,255,255,0.7)", borderColor: "rgba(0,0,0,0.05)" }}
    >
      <span className="text-[10px] font-extrabold tracking-[0.16em] uppercase px-1.5 py-0.5 rounded" style={{ backgroundColor: INK, color: "#fff" }}>
        Demo
      </span>
      <Seg
        testid="seg-people"
        value={String(people)}
        onChange={(v) => setPeople(Number(v))}
        options={[
          { label: "2 people", val: "2" },
          { label: "3+ people", val: "3" },
        ]}
      />
      <Seg
        testid="seg-matches"
        value={multiple ? "multi" : "single"}
        onChange={(v) => setMultiple(v === "multi")}
        options={[
          { label: "1 match", val: "single" },
          { label: "Multiple", val: "multi" },
        ]}
      />
      <Seg
        testid="seg-mode"
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        options={[
          { label: "Dishes", val: "dish" },
          { label: "Restaurants", val: "restaurant" },
        ]}
      />
    </div>
  );
}
