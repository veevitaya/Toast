import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Sparkles,
  Wallet,
  Leaf,
  Utensils,
  Users,
  Check,
  Filter,
  Heart,
  X,
  Flame,
  Fish,
  Pizza,
  Soup,
  Star,
  Navigation,
  RotateCcw,
  PartyPopper,
} from "lucide-react";

const GOLD = "#FFCC02";
const CREAM = "#FAF6EF";
const INK = "#1A1A1A";
const MUTE = "#9A938A";
const LINE = "#06C755";

type Step = "host" | "prefs" | "filter" | "swipe" | "match" | "places";
const ORDER: Step[] = ["host", "prefs", "filter", "swipe", "match", "places"];

const STAGES = ["Plan", "Taste", "Swipe", "Match", "Eat"];
const stageOf = (s: Step): number =>
  s === "host" ? 0 : s === "prefs" || s === "filter" ? 1 : s === "swipe" ? 2 : s === "match" ? 3 : 4;

const DATES = ["Fri, Jun 19", "Sat, Jun 20", "Sun, Jun 21"];
const TIMES = ["7:00 PM", "8:30 PM", "Lunch, 12:30"];
const AREAS = ["Thonglor", "Near BTS Asok", "Riverside"];

const MOODS = ["Comfort", "Adventurous", "Light", "Indulgent"];
const CUISINE_OPTS = ["Thai", "Japanese", "Italian", "Korean", "Street food", "Café"];
const DIET_OPTS = ["Veg option", "Halal", "No pork", "No nuts"];

type Member = { initial: string; name: string; tags: string[] };
const MEMBERS: Member[] = [
  { initial: "Y", name: "You", tags: ["Spicy", "฿฿"] },
  { initial: "M", name: "Mint", tags: ["Thai", "฿฿"] },
  { initial: "P", name: "Ploy", tags: ["Veg option", "฿"] },
  { initial: "B", name: "Bank", tags: ["Comfort", "฿฿"] },
];

type Dish = {
  id: string;
  name: string;
  cuisine: string;
  desc: string;
  price: string;
  Icon: typeof Fish;
  tint: string;
  fit: string[];
  likedBy: string[];
  consensus?: boolean;
};

const DISHES: Dish[] = [
  {
    id: "sushi",
    name: "Salmon Sushi Set",
    cuisine: "Japanese",
    desc: "Light, fresh, shareable platter",
    price: "฿฿",
    Icon: Fish,
    tint: "#E8F1FB",
    fit: ["Light", "฿฿", "Veg option"],
    likedBy: ["Y", "M", "B"],
  },
  {
    id: "pizza",
    name: "Wood-fired Pizza",
    cuisine: "Italian",
    desc: "Crowd-pleasing comfort to split",
    price: "฿฿",
    Icon: Pizza,
    tint: "#FBEAE6",
    fit: ["Comfort", "฿฿"],
    likedBy: ["Y", "P"],
  },
  {
    id: "tomyum",
    name: "Tom Yum Noodles",
    cuisine: "Thai",
    desc: "Bright, spicy, deeply Thai",
    price: "฿",
    Icon: Soup,
    tint: "#FCEFD6",
    fit: ["Spicy", "฿", "Veg option"],
    likedBy: ["Y", "M", "P"],
  },
  {
    id: "krapow",
    name: "Pad Krapow Moo",
    cuisine: "Thai",
    desc: "The unanimous favourite — spicy basil over rice",
    price: "฿฿",
    Icon: Flame,
    tint: "#FFF3CC",
    fit: ["Spicy", "฿฿", "Thai"],
    likedBy: ["Y", "M", "P", "B"],
    consensus: true,
  },
];

type Place = { name: string; rating: number; dist: string; price: string; note: string };
const PLACES: Place[] = [
  { name: "Krua Apsorn", rating: 4.7, dist: "400 m", price: "฿฿", note: "Famous for Pad Krapow" },
  { name: "Soi 38 Kitchen", rating: 4.5, dist: "650 m", price: "฿", note: "Street-style, fast" },
  { name: "Baan Phadthai", rating: 4.6, dist: "1.1 km", price: "฿฿", note: "Sit-down, group tables" },
];

export default function GroupTasteFlow() {
  const [step, setStep] = useState<Step>("host");

  const [dateIdx, setDateIdx] = useState(0);
  const [timeIdx, setTimeIdx] = useState(0);
  const [areaIdx, setAreaIdx] = useState(0);

  const [mood, setMood] = useState("Comfort");
  const [cuisines, setCuisines] = useState<string[]>(["Thai", "Japanese"]);
  const [budget, setBudget] = useState(1);
  const [diet, setDiet] = useState<string[]>(["Veg option"]);

  const [cardIdx, setCardIdx] = useState(0);
  const [lastResult, setLastResult] = useState<{ name: string; count: number; type: "like" | "pass" } | null>(null);

  const back = () => {
    const i = ORDER.indexOf(step);
    if (i > 0) setStep(ORDER[i - 1]);
  };

  const toggle = (val: string, arr: string[], set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const dish = DISHES[cardIdx];

  const onPass = () => {
    setLastResult({ name: dish.name, count: dish.likedBy.length, type: "pass" });
    setCardIdx((i) => (i + 1) % DISHES.length);
  };
  const onLike = () => {
    if (dish.consensus) {
      setStep("match");
      return;
    }
    setLastResult({ name: dish.name, count: dish.likedBy.length, type: "like" });
    setCardIdx((i) => (i + 1) % DISHES.length);
  };

  const restart = () => {
    setCardIdx(0);
    setLastResult(null);
    setStep("host");
  };

  return (
    <div
      className="max-w-[430px] mx-auto min-h-[100dvh] relative flex flex-col font-['Inter']"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      {/* Header + stepper */}
      <header className="px-6 pt-14 pb-2">
        <div className="flex items-center justify-between">
          <button
            aria-label="Go back"
            data-testid="button-back"
            onClick={back}
            disabled={step === "host"}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform disabled:opacity-40"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-[12px] font-semibold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
            Group session
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-4" data-testid="stepper">
          {STAGES.map((label, i) => {
            const cur = stageOf(step);
            const done = i < cur;
            const active = i === cur;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full h-1.5 rounded-full"
                  style={{ backgroundColor: done || active ? GOLD : "rgba(26,26,26,0.1)" }}
                />
                <span
                  className="text-[10px] font-semibold tracking-wide"
                  style={{ color: active ? INK : MUTE, opacity: active ? 1 : 0.7 }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </header>

      {/* ---------- HOST ---------- */}
      {step === "host" && (
        <>
          <main className="flex-1 px-6 pb-44 pt-4">
            <h1 className="font-['Plus_Jakarta_Sans'] text-[27px] font-bold tracking-tight leading-tight">
              Set the plan
            </h1>
            <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
              You lock the when &amp; where. Everyone picks their own taste next — Toast finds what works for all.
            </p>

            <div
              className="mt-6 rounded-[24px] bg-white p-6"
              style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}
            >
              {[
                { id: "date", label: "Date", Icon: Calendar, value: DATES[dateIdx], onTap: () => setDateIdx((i) => (i + 1) % DATES.length) },
                { id: "time", label: "Time", Icon: Clock, value: TIMES[timeIdx], onTap: () => setTimeIdx((i) => (i + 1) % TIMES.length) },
                { id: "area", label: "Area", Icon: MapPin, value: AREAS[areaIdx], onTap: () => setAreaIdx((i) => (i + 1) % AREAS.length) },
              ].map((row, i) => (
                <div key={row.id}>
                  {i > 0 && <div className="h-px" style={{ backgroundColor: "rgba(26,26,26,0.06)" }} />}
                  <button
                    data-testid={`button-${row.id}`}
                    onClick={row.onTap}
                    className="w-full flex items-center gap-3.5 py-3.5 text-left active:scale-[0.99] transition-transform"
                  >
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CREAM }}>
                      <row.Icon className="w-5 h-5" style={{ color: INK }} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[11px] uppercase tracking-wider font-semibold" style={{ color: MUTE }}>
                        {row.label}
                      </span>
                      <span className="block font-['Plus_Jakarta_Sans'] text-[16px] font-bold">{row.value}</span>
                    </span>
                    <span className="text-[12px] font-semibold" style={{ color: MUTE }}>
                      tap
                    </span>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex -space-x-2">
                {MEMBERS.map((m) => (
                  <span
                    key={m.initial}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[12px] font-bold border-2 border-white"
                    style={{ backgroundColor: "#F3F1EC", color: INK }}
                  >
                    {m.initial}
                  </span>
                ))}
              </div>
              <span className="text-[13px]" style={{ color: MUTE }}>
                4 invited to this dinner
              </span>
            </div>
          </main>

          <Footer>
            <PrimaryButton testid="button-send" color={LINE} text onClick={() => setStep("prefs")}>
              <Share2 className="w-5 h-5" /> Send to the group
            </PrimaryButton>
          </Footer>
        </>
      )}

      {/* ---------- PREFS ---------- */}
      {step === "prefs" && (
        <>
          <main className="flex-1 px-6 pb-44 pt-4">
            <h1 className="font-['Plus_Jakarta_Sans'] text-[27px] font-bold tracking-tight leading-tight">
              Your taste, your call
            </h1>
            <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
              Each person sets their own. Toast overlaps everyone to find dishes that fit the whole table.
            </p>

            {/* Mood */}
            <Section icon={<Sparkles className="w-4 h-4" />} title="Mood">
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <Chip key={m} testid={`mood-${m}`} active={mood === m} onClick={() => setMood(m)}>
                    {m}
                  </Chip>
                ))}
              </div>
            </Section>

            {/* Cuisines */}
            <Section icon={<Utensils className="w-4 h-4" />} title="Cuisines" hint="pick any">
              <div className="flex flex-wrap gap-2">
                {CUISINE_OPTS.map((c) => (
                  <Chip key={c} testid={`cuisine-${c}`} active={cuisines.includes(c)} onClick={() => toggle(c, cuisines, setCuisines)}>
                    {c}
                  </Chip>
                ))}
              </div>
            </Section>

            {/* Budget */}
            <Section icon={<Wallet className="w-4 h-4" />} title="Budget">
              <div className="flex gap-2">
                {["฿", "฿฿", "฿฿฿"].map((b, i) => (
                  <button
                    key={b}
                    data-testid={`budget-${i}`}
                    onClick={() => setBudget(i)}
                    aria-pressed={budget === i}
                    className="flex-1 h-12 rounded-2xl font-['Plus_Jakarta_Sans'] text-[16px] font-bold border transition-all active:scale-[0.98]"
                    style={budget === i ? { backgroundColor: GOLD, color: INK, borderColor: GOLD } : { backgroundColor: "#fff", color: MUTE, borderColor: "rgba(26,26,26,0.12)" }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </Section>

            {/* Diet */}
            <Section icon={<Leaf className="w-4 h-4" />} title="Restrictions" hint="optional">
              <div className="flex flex-wrap gap-2">
                {DIET_OPTS.map((d) => (
                  <Chip key={d} testid={`diet-${d}`} active={diet.includes(d)} onClick={() => toggle(d, diet, setDiet)}>
                    {d}
                  </Chip>
                ))}
              </div>
            </Section>
          </main>

          <Footer>
            <PrimaryButton testid="button-ready" color={GOLD} onClick={() => setStep("filter")}>
              I'm ready <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </Footer>
        </>
      )}

      {/* ---------- FILTER ---------- */}
      {step === "filter" && (
        <>
          <main className="flex-1 px-6 pb-44 pt-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-[12px] font-bold tracking-[0.16em] uppercase" style={{ color: MUTE }}>
                Finding common ground
              </span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[27px] font-bold tracking-tight leading-tight mt-2">
              Everyone's in
            </h1>

            <div
              className="mt-5 rounded-[24px] bg-white p-5"
              style={{ boxShadow: "0 18px 40px -18px rgba(0,0,0,0.16)", border: "1px solid rgba(0,0,0,0.05)" }}
            >
              <div className="space-y-3.5">
                {MEMBERS.map((m) => (
                  <div key={m.initial} className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[14px] font-bold shrink-0" style={{ backgroundColor: "#F3F1EC", color: INK }}>
                      {m.initial}
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[15px] font-semibold w-12 shrink-0">{m.name}</span>
                    <span className="flex flex-wrap gap-1.5 flex-1">
                      {m.tags.map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ backgroundColor: CREAM, color: MUTE }}>
                          {t}
                        </span>
                      ))}
                    </span>
                    <Check className="w-4 h-4 shrink-0" strokeWidth={3} style={{ color: LINE }} />
                  </div>
                ))}
              </div>
            </div>

            <div
              className="mt-5 rounded-[24px] p-6 text-center"
              style={{ backgroundColor: GOLD, boxShadow: "0 18px 40px -18px rgba(255,204,2,0.7)" }}
            >
              <Sparkles className="w-6 h-6 mx-auto" style={{ color: INK }} />
              <p className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold mt-2 leading-tight">
                6 dishes fit
                <br />
                all four of you
              </p>
              <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(26,26,26,0.7)" }}>
                Common ground: Thai · mid-budget · a little spice
              </p>
            </div>
          </main>

          <Footer>
            <PrimaryButton testid="button-startswipe" color={GOLD} onClick={() => setStep("swipe")}>
              Start swiping <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </Footer>
        </>
      )}

      {/* ---------- SWIPE ---------- */}
      {step === "swipe" && (
        <>
          <main className="flex-1 px-6 pb-44 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold" style={{ color: MUTE }}>
                Card {cardIdx + 1} of {DISHES.length}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-bold" style={{ color: INK }}>
                <Users className="w-4 h-4" style={{ color: MUTE }} /> aiming for 4 / 4
              </span>
            </div>

            {lastResult && (
              <div
                className="mt-3 flex items-center gap-2 rounded-2xl px-3.5 py-2.5"
                style={{
                  backgroundColor: lastResult.type === "like" ? "rgba(255,204,2,0.16)" : "#F3F1EC",
                }}
                data-testid="banner-result"
              >
                {lastResult.type === "like" ? (
                  <Heart className="w-4 h-4 shrink-0" style={{ color: "#C79200" }} />
                ) : (
                  <X className="w-4 h-4 shrink-0" style={{ color: MUTE }} />
                )}
                <span className="text-[13px] font-medium" style={{ color: INK }}>
                  {lastResult.type === "like"
                    ? `Partial match — ${lastResult.count} of 4 on ${lastResult.name}. Keep swiping for a full match.`
                    : `Skipped ${lastResult.name}. Next up…`}
                </span>
              </div>
            )}

            {/* Dish card */}
            <div
              className="mt-4 rounded-[26px] bg-white overflow-hidden"
              style={{ boxShadow: "0 22px 48px -22px rgba(0,0,0,0.28)", border: "1px solid rgba(0,0,0,0.05)" }}
              data-testid={`card-dish-${dish.id}`}
            >
              <div className="relative h-[168px] flex items-center justify-center" style={{ backgroundColor: dish.tint }}>
                <dish.Icon className="w-20 h-20" strokeWidth={1.25} style={{ color: INK, opacity: 0.55 }} />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/85 text-[12px] font-bold backdrop-blur">
                  {dish.cuisine}
                </span>
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[12px] font-bold" style={{ backgroundColor: INK, color: "#fff" }}>
                  {dish.price}
                </span>
              </div>

              <div className="p-5">
                <h2 className="font-['Plus_Jakarta_Sans'] text-[21px] font-bold tracking-tight leading-tight">{dish.name}</h2>
                <p className="text-[14px] mt-1" style={{ color: "rgba(26,26,26,0.6)" }}>{dish.desc}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {dish.fit.map((f) => (
                    <span key={f} className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ backgroundColor: CREAM, color: INK }}>
                      {f}
                    </span>
                  ))}
                </div>

                <div className="h-px my-4" style={{ backgroundColor: "rgba(26,26,26,0.07)" }} />

                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: MUTE }}>
                    Who's into it
                  </span>
                  <span className="text-[13px] font-bold" style={{ color: dish.consensus ? LINE : "#C79200" }}>
                    {dish.likedBy.length} of 4
                  </span>
                </div>
                <div className="flex gap-2 mt-2.5">
                  {MEMBERS.map((m) => {
                    const likes = dish.likedBy.includes(m.initial);
                    return (
                      <span
                        key={m.initial}
                        className="w-9 h-9 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[13px] font-bold transition-all"
                        style={
                          likes
                            ? { backgroundColor: GOLD, color: INK }
                            : { backgroundColor: "#F3F1EC", color: MUTE, opacity: 0.6 }
                        }
                      >
                        {m.initial}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </main>

          <Footer>
            <div className="flex items-center justify-center gap-5">
              <button
                data-testid="button-pass"
                onClick={onPass}
                aria-label="Pass on this dish"
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center border active:scale-90 transition-transform"
                style={{ borderColor: "rgba(26,26,26,0.12)", boxShadow: "0 8px 20px -10px rgba(0,0,0,0.25)" }}
              >
                <X className="w-7 h-7" style={{ color: MUTE }} strokeWidth={2.5} />
              </button>
              <button
                data-testid="button-like"
                onClick={onLike}
                aria-label="Like this dish"
                className="w-20 h-20 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                style={{ backgroundColor: GOLD, boxShadow: "0 12px 26px -10px rgba(255,204,2,0.8)" }}
              >
                <Heart className="w-9 h-9" style={{ color: INK }} fill={INK} />
              </button>
            </div>
          </Footer>
        </>
      )}

      {/* ---------- MATCH ---------- */}
      {step === "match" && (
        <>
          <main className="flex-1 px-6 pb-44 pt-6 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: "rgba(6,199,85,0.12)" }}>
              <PartyPopper className="w-4 h-4" style={{ color: LINE }} />
              <span className="text-[13px] font-bold" style={{ color: LINE }}>
                It's unanimous
              </span>
            </div>

            <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold tracking-tight leading-tight mt-5">
              All four of you
              <br />
              swiped right
            </h1>

            <div
              className="mt-7 w-full rounded-[28px] bg-white overflow-hidden"
              style={{ boxShadow: "0 22px 48px -22px rgba(0,0,0,0.28)", border: "1px solid rgba(0,0,0,0.05)" }}
            >
              <div className="h-[150px] flex items-center justify-center" style={{ backgroundColor: "#FFF3CC" }}>
                <Flame className="w-20 h-20" strokeWidth={1.25} style={{ color: INK, opacity: 0.6 }} />
              </div>
              <div className="p-6">
                <p className="text-[12px] font-bold tracking-[0.18em] uppercase" style={{ color: MUTE }}>
                  Your match
                </p>
                <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold tracking-tight mt-1">Pad Krapow Moo</h2>
                <div className="flex justify-center gap-2 mt-4">
                  {MEMBERS.map((m) => (
                    <span
                      key={m.initial}
                      className="w-10 h-10 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans'] text-[14px] font-bold"
                      style={{ backgroundColor: GOLD, color: INK }}
                    >
                      {m.initial}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </main>

          <Footer>
            <PrimaryButton testid="button-seeplaces" color={GOLD} onClick={() => setStep("places")}>
              See places serving it <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </Footer>
        </>
      )}

      {/* ---------- PLACES ---------- */}
      {step === "places" && (
        <>
          <main className="flex-1 px-6 pb-44 pt-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-bold" style={{ backgroundColor: "#FFF3CC", color: INK }}>
              <Flame className="w-4 h-4" /> Pad Krapow Moo
            </span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[27px] font-bold tracking-tight leading-tight mt-3">
              Where to eat it
            </h1>
            <p className="text-[15px] mt-1.5 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
              Serving your match near {AREAS[areaIdx]} · {DATES[dateIdx]}, {TIMES[timeIdx]}
            </p>

            <div className="mt-5 space-y-3">
              {PLACES.map((p, i) => (
                <div
                  key={p.name}
                  data-testid={`card-place-${i}`}
                  className="rounded-[22px] bg-white p-4 flex items-center gap-4"
                  style={{ boxShadow: "0 14px 34px -20px rgba(0,0,0,0.2)", border: "1px solid rgba(0,0,0,0.05)" }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: CREAM }}>
                    <Utensils className="w-6 h-6" style={{ color: INK }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold truncate">{p.name}</p>
                    <p className="text-[12.5px] mt-0.5" style={{ color: MUTE }}>{p.note}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[12.5px] font-semibold" style={{ color: INK }}>
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" fill={GOLD} style={{ color: GOLD }} /> {p.rating}
                      </span>
                      <span className="inline-flex items-center gap-1" style={{ color: MUTE }}>
                        <Navigation className="w-3.5 h-3.5" /> {p.dist}
                      </span>
                      <span style={{ color: MUTE }}>{p.price}</span>
                    </div>
                  </div>
                  <button
                    data-testid={`button-open-${i}`}
                    aria-label={`Open ${p.name}`}
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                    style={{ backgroundColor: GOLD }}
                  >
                    <ArrowRight className="w-5 h-5" style={{ color: INK }} />
                  </button>
                </div>
              ))}
            </div>

            <button
              data-testid="button-restart"
              onClick={restart}
              className="w-full mt-6 inline-flex items-center justify-center gap-2 text-[14px] font-semibold py-2 active:scale-[0.99] transition-transform"
              style={{ color: MUTE }}
            >
              <RotateCcw className="w-4 h-4" /> Replay the flow
            </button>
          </main>

          <Footer>
            <PrimaryButton testid="button-locktable" color={LINE} text onClick={() => setStep("places")}>
              <Share2 className="w-5 h-5" /> Share the plan to LINE
            </PrimaryButton>
          </Footer>
        </>
      )}
    </div>
  );
}

/* ---------- small building blocks ---------- */

function Footer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 pb-10"
      style={{ background: `linear-gradient(to top, ${CREAM} 78%, rgba(250,246,239,0))` }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  color,
  text,
  testid,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color: string;
  text?: boolean;
  testid: string;
}) {
  return (
    <button
      data-testid={testid}
      onClick={onClick}
      className="w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      style={{
        backgroundColor: color,
        color: text ? "#fff" : INK,
        boxShadow: `0 8px 20px -8px ${color === LINE ? "rgba(6,199,85,0.5)" : "rgba(255,204,2,0.55)"}`,
      }}
    >
      {children}
    </button>
  );
}

function Section({ icon, title, hint, children }: { icon: React.ReactNode; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-2.5">
        <span style={{ color: GOLD }}>{icon}</span>
        <span className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold">{title}</span>
        {hint && <span className="text-[12px]" style={{ color: MUTE }}>· {hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Chip({ children, active, onClick, testid }: { children: React.ReactNode; active: boolean; onClick: () => void; testid: string }) {
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
