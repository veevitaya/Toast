import { useState, useEffect, useMemo } from "react";

type WeatherCondition = "clear" | "cloudy" | "rainy" | "stormy" | "hot" | "humid" | "unknown";
type TimeSlot = "early_morning" | "morning" | "lunch" | "afternoon" | "evening" | "late_night";

export interface TasteContext {
  topLabel: string;
  topKey: string;
  score: number;
  secondLabel?: string;
  totalSwipes: number;
}

interface WeatherGreeting {
  headline: string;
  sub: string;
  emoji: string;
  weatherCondition: WeatherCondition;
  tempC: number | null;
}

function getTimeSlot(): TimeSlot {
  const h = new Date().getHours();
  if (h < 7) return "early_morning";
  if (h < 11) return "morning";
  if (h < 14) return "lunch";
  if (h < 17) return "afternoon";
  if (h < 21) return "evening";
  return "late_night";
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const GREETINGS: Record<TimeSlot, Record<WeatherCondition, { headlines: string[]; subs: string[]; emoji: string }>> = {
  early_morning: {
    clear: { headlines: ["Rise & dine!", "Early bird eats first 🐣"], subs: ["Clear skies, perfect for a morning bite", "Bangkok's waking up — grab something fresh"], emoji: "☀️" },
    cloudy: { headlines: ["Cloudy morning vibes", "Cozy morning ahead"], subs: ["Overcast but your appetite's shining", "Perfect weather for congee or dim sum"], emoji: "☁️" },
    rainy: { headlines: ["Rainy morning comfort", "Pitter-patter breakfast"], subs: ["Nothing beats hot food on a rainy morning", "Rain + warm soup = perfect combo"], emoji: "🌧️" },
    stormy: { headlines: ["Stay dry, eat warm", "Stormy but cozy"], subs: ["Skip the commute, order something warm", "Let the storm pass with a hot bowl"], emoji: "⛈️" },
    hot: { headlines: ["Already warm out there!", "Hot morning, cool eats"], subs: ["Start the day with something refreshing", "Smoothie bowl weather, honestly"], emoji: "🔥" },
    humid: { headlines: ["Sticky morning alert", "Humid but hungry"], subs: ["Cool down with a fresh juice and bites", "Bangkok humidity calls for iced coffee"], emoji: "💧" },
    unknown: { headlines: ["Good morning!", "Rise & shine!"], subs: ["What sounds good this morning?", "Start your day with something tasty"], emoji: "🌅" },
  },
  morning: {
    clear: { headlines: ["Sunny & starving?", "Beautiful morning to eat out!"], subs: ["Sunshine + street food = happiness", "Clear skies, time for brunch?"], emoji: "☀️" },
    cloudy: { headlines: ["Cloudy cravings?", "Overcast but delicious"], subs: ["Great weather for a cozy café", "Clouds can't dim your appetite"], emoji: "☁️" },
    rainy: { headlines: ["Rainy day comfort food", "Let it rain, let's eat!"], subs: ["Hot noodles hit different in the rain", "Umbrella in one hand, food in the other"], emoji: "🌧️" },
    stormy: { headlines: ["Storm's brewing, so should soup", "Thunder & hunger"], subs: ["Stay in, order something amazing", "Let delivery save your morning"], emoji: "⛈️" },
    hot: { headlines: ["It's a hot one!", "Scorcher alert 🥵"], subs: ["Ice cream for breakfast? We won't judge", "Beat the heat with cold noodles"], emoji: "🔥" },
    humid: { headlines: ["Muggy morning munchies", "Humidity level: max"], subs: ["Your AC + delivery = self care", "Cool down with something light and fresh"], emoji: "💧" },
    unknown: { headlines: ["Morning cravings?", "What's for brunch?"], subs: ["Bangkok's kitchens are ready for you", "Something delicious is waiting"], emoji: "🌤️" },
  },
  lunch: {
    clear: { headlines: ["Lunch under blue skies!", "Sunny lunch hour ☀️"], subs: ["Perfect weather for outdoor eats", "Take a lunch walk and grab a bite"], emoji: "☀️" },
    cloudy: { headlines: ["Cloudy lunch break", "Overcast = cozy lunch"], subs: ["Skip the sad desk lunch today", "Comfort food weather, for real"], emoji: "☁️" },
    rainy: { headlines: ["Rainy lunch rescue!", "Don't let rain ruin lunch"], subs: ["Delivery to the rescue — stay dry, eat well", "Hot curry + rain = Bangkok perfection"], emoji: "🌧️" },
    stormy: { headlines: ["Storm lunch special", "Stuck inside? Eat well!"], subs: ["Order in something amazing", "Let the storm rage, you've got food"], emoji: "⛈️" },
    hot: { headlines: ["Too hot to cook!", "Beat the midday heat"], subs: ["Som tam and iced tea kind of day", "Cold noodles are calling your name"], emoji: "🔥" },
    humid: { headlines: ["Humid lunch hour", "Sticky afternoon ahead"], subs: ["AC restaurant > eating outside today", "Stay cool with something refreshing"], emoji: "💧" },
    unknown: { headlines: ["Lunch o'clock!", "What's for lunch?"], subs: ["Your midday meal awaits", "Time to fuel up"], emoji: "🍜" },
  },
  afternoon: {
    clear: { headlines: ["Sunny snack time!", "Afternoon cravings?"], subs: ["Perfect weather for café hopping", "Golden hour snacking hits different"], emoji: "☀️" },
    cloudy: { headlines: ["Cloudy afternoon munchies", "Afternoon pick-me-up?"], subs: ["Coffee and cake kind of weather", "Grab a late afternoon treat"], emoji: "☁️" },
    rainy: { headlines: ["Rainy afternoon treat", "Rain + snacks = mood"], subs: ["Hot chocolate and pastry weather", "Let the rain set the cozy vibe"], emoji: "🌧️" },
    stormy: { headlines: ["Stormy snack attack", "Thunderstorm treat time"], subs: ["Stay in with something sweet", "The storm outside, warmth inside"], emoji: "⛈️" },
    hot: { headlines: ["Cooling down yet? 🍦", "Still blazing out there"], subs: ["Mango sticky rice weather for sure", "Frozen treats are a necessity, not a luxury"], emoji: "🔥" },
    humid: { headlines: ["Bangkok humidity strikes", "Sweaty afternoon?"], subs: ["You deserve a cold drink and snack", "Find the nearest AC and good food"], emoji: "💧" },
    unknown: { headlines: ["Afternoon nibbles?", "Snack o'clock!"], subs: ["Something light or something sweet?", "Treat yourself this afternoon"], emoji: "🍰" },
  },
  evening: {
    clear: { headlines: ["Clear evening, great eats!", "Dinner under the stars ✨"], subs: ["Perfect night for rooftop dining", "Bangkok nights + good food = magic"], emoji: "🌙" },
    cloudy: { headlines: ["Cozy dinner time", "Evening comfort food"], subs: ["Cloudy night, warm food", "Nothing beats a proper dinner tonight"], emoji: "☁️" },
    rainy: { headlines: ["Rainy night feast!", "Rain makes dinner better"], subs: ["Hot pot weather has arrived", "The sound of rain + sizzling food"], emoji: "🌧️" },
    stormy: { headlines: ["Storm night in!", "Wild night? Eat in!"], subs: ["Skip going out, bring dinner home", "Cozy up with delivery tonight"], emoji: "⛈️" },
    hot: { headlines: ["Hot night, cool eats", "Warm evening ahead"], subs: ["Night market weather if you're brave", "Spicy food to match the heat?"], emoji: "🔥" },
    humid: { headlines: ["Humid evening dining", "Muggy night out"], subs: ["AC restaurant sounds perfect tonight", "Cool down with your dinner choices"], emoji: "💧" },
    unknown: { headlines: ["Dinner time!", "What's for dinner?"], subs: ["Bangkok's best is waiting for you", "Time for something delicious"], emoji: "🍽️" },
  },
  late_night: {
    clear: { headlines: ["Midnight munchies!", "Night owl eats 🦉"], subs: ["Clear night, perfect for street food", "The best food comes out after dark"], emoji: "🌙" },
    cloudy: { headlines: ["Late night cravings?", "Can't sleep, won't starve"], subs: ["Cloudy night comfort food", "Late night = no judgment zone"], emoji: "☁️" },
    rainy: { headlines: ["Rainy midnight snack", "Rain + ramen = yes"], subs: ["The best time for a warm bowl", "Nothing cozier than late-night noodles in the rain"], emoji: "🌧️" },
    stormy: { headlines: ["Storm night comfort", "Thunder & noodles"], subs: ["Wild night outside, warm food inside", "Delivery heroes to the rescue"], emoji: "⛈️" },
    hot: { headlines: ["Hot night hunger!", "Too warm to sleep?"], subs: ["Might as well eat something cold", "Late night ice cream run?"], emoji: "🔥" },
    humid: { headlines: ["Humid night hunger", "Sticky night snacking"], subs: ["Cool treats for a muggy night", "Bangkok never sleeps and neither do you"], emoji: "💧" },
    unknown: { headlines: ["Late night craving?", "Still up? Let's eat!"], subs: ["The city that never sleeps, never stops eating", "Your midnight feast awaits"], emoji: "🌙" },
  },
};

function buildPersonalizedSub(
  taste: TasteContext | undefined,
  weather: WeatherCondition,
  slot: TimeSlot,
  fallbackSub: string
): string {
  if (!taste || taste.score <= 0 || taste.totalSwipes < 2) return fallbackSub;

  const top = taste.topLabel;
  const second = taste.secondLabel;
  const hasDeep = taste.totalSwipes >= 10;

  const PERSONALIZED: Record<TimeSlot, Record<WeatherCondition, string[]>> = {
    early_morning: {
      clear:  [`We know you love ${top} — perfect morning for it`, `Your ${top} craving + sunshine = sorted`],
      cloudy: [`Cloudy mornings call for your favourite ${top}`, `Cozy weather, and we saved your ${top} spots`],
      rainy:  [`Rain + ${top}? We already know the answer`, `Your go-to ${top} hits different in the rain`],
      stormy: [`Storm outside, but your ${top} spots are ready`, `Stay in — we'll find your ${top} fix`],
      hot:    [`Hot morning, but we know you still want ${top}`, `Beat the heat with your favourite ${top}`],
      humid:  [`Sticky morning — your ${top} cravings don't care`, `We know the humidity won't stop your ${top} love`],
      unknown:[`Your ${top} spots are warming up for you`, `Ready to find your morning ${top}?`],
    },
    morning: {
      clear:  [`Sunshine + your love for ${top} = perfect combo`, `We picked ${top} spots just for you today`],
      cloudy: [`Cloudy but your ${top} radar is clear`, `Perfect weather to hit your favourite ${top} spots`],
      rainy:  [`Rainy mornings were made for ${top}`, `We know you — ${top} when it rains, always`],
      stormy: [`Your ${top} delivery game is strong today`, `Storm can't stop your ${top} craving`],
      hot:    [`Already hot — your ${top} spots have AC though`, `${top} fan? We've got cool spots lined up`],
      humid:  [`Muggy but your ${top} game stays strong`, `Your ${top} spots are calling — AC included`],
      unknown:[`${top} spots curated just for you`, `Your morning ${top} fix awaits`],
    },
    lunch: {
      clear:  [`Sunny lunch — we lined up your ${top} picks`, `Your ${top} craving + blue skies, let's go`],
      cloudy: [`Skip the desk lunch — your ${top} spots miss you`, `We know it's ${top} o'clock for you`],
      rainy:  [`Rainy lunch = ${top} delivery, we know you well`, `Hot ${top} in the rain — your kind of perfect`],
      stormy: [`Order your favourite ${top} in — we've got options`, `Storm lunch + ${top} = the move`],
      hot:    [`Too hot to cook — let your ${top} spots handle it`, `Your ${top} lunch, no sweating required`],
      humid:  [`AC + your favourite ${top} = lunch sorted`, `We know you'd choose ${top} — spots are ready`],
      unknown:[`Your ${top} lunch picks are ready`, `Curated ${top} for your lunch hour`],
    },
    afternoon: {
      clear:  [`Afternoon ${top} break? We read your mind`, `Golden hour + ${top} — very you`],
      cloudy: [`Cloudy afternoon, your ${top} mood is clear`, `We see that ${top} craving coming a mile away`],
      rainy:  [`Rain + afternoon ${top} = self care`, `Your ${top} treat for a rainy afternoon`],
      stormy: [`Stay cozy — we've got ${top} spots for you`, `Storm snacking with your favourite ${top}`],
      hot:    [`Cooling down with ${top}? We know you`, `Your afternoon ${top} fix, AC guaranteed`],
      humid:  [`Humid but you still want ${top}, right?`, `We know — ${top} no matter the weather`],
      unknown:[`Your afternoon ${top} picks are ready`, `Time for your ${top} break`],
    },
    evening: {
      clear:  [`Clear night, ${top} on your mind — we know`, `Your ${top} dinner spots are glowing tonight`],
      cloudy: [`Cozy evening + ${top} = your kind of night`, `We matched tonight's mood to your ${top} love`],
      rainy:  [`Rainy dinner night — ${top} is the answer`, `We know you + rain + ${top} = happiness`],
      stormy: [`Stay in with ${top} tonight — sorted for you`, `Your ${top} comfort food for a stormy night`],
      hot:    [`Warm night — your ${top} spots have you covered`, `Evening ${top} vibes, just like you like it`],
      humid:  [`Muggy evening but ${top} always hits right`, `Your ${top} dinner mood, perfectly matched`],
      unknown:[`Tonight's ${top} picks — chosen for you`, `Your evening ${top} lineup is ready`],
    },
    late_night: {
      clear:  [`Late night ${top} run? We saw that coming`, `Clear skies, late cravings — your ${top} spots await`],
      cloudy: [`Can't sleep? Your ${top} spots are still open`, `Midnight ${top} craving — we've got you`],
      rainy:  [`Rain + midnight + ${top} = your signature move`, `Late night ${top} in the rain — so you`],
      stormy: [`Storm night ${top} delivery — we know the drill`, `Your ${top} comfort for a wild night`],
      hot:    [`Hot night, ${top} craving — we get you`, `Can't sleep in this heat? ${top} it is`],
      humid:  [`Sticky night — your ${top} spots are still serving`, `Late night ${top} regardless — very you`],
      unknown:[`Your late night ${top} fix is ready`, `Midnight ${top} — we know you too well`],
    },
  };

  const pool = PERSONALIZED[slot]?.[weather] || PERSONALIZED[slot]?.unknown || [fallbackSub];

  if (hasDeep && second && Math.random() > 0.6) {
    const deepSubs = [
      `${top} lover with a soft spot for ${second} — we see you`,
      `Your tastes? ${top} first, ${second} close behind`,
      `We know it's ${top} today, ${second} tomorrow`,
      `${top} and ${second} — your flavour fingerprint`,
    ];
    return pickRandom(deepSubs);
  }

  return pickRandom(pool);
}

export function useWeatherGreeting(taste?: TasteContext): WeatherGreeting {
  const [weather, setWeather] = useState<{ condition: WeatherCondition; tempC: number | null }>({
    condition: "unknown",
    tempC: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=13.7563&longitude=100.5018&current=temperature_2m,weather_code&timezone=Asia%2FBangkok",
          { signal: AbortSignal.timeout(5000) }
        );
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();
        const tempC = Math.round(data.current?.temperature_2m ?? 30);
        const wmoCode = data.current?.weather_code ?? 0;
        const condition = mapWmoCode(wmoCode, tempC);
        if (!cancelled) {
          setWeather({ condition, tempC });
        }
      } catch {
        if (!cancelled) {
          setWeather({ condition: guessFromTime(), tempC: null });
        }
      }
    }

    fetchWeather();
    return () => { cancelled = true; };
  }, []);

  const greeting = useMemo(() => {
    const slot = getTimeSlot();
    const pool = GREETINGS[slot][weather.condition];
    const weatherSub = pickRandom(pool.subs);
    const sub = buildPersonalizedSub(taste, weather.condition, slot, weatherSub);

    return {
      headline: pickRandom(pool.headlines),
      sub,
      emoji: pool.emoji,
      weatherCondition: weather.condition,
      tempC: weather.tempC,
    };
  }, [weather, taste?.topKey, taste?.score, taste?.totalSwipes]);

  return greeting;
}

function mapWmoCode(code: number, tempC: number): WeatherCondition {
  if (code === 0 || code === 1) {
    if (tempC >= 36) return "hot";
    if (tempC >= 31) return "humid";
    return "clear";
  }
  if (code === 2 || code === 3) return "cloudy";
  if (code >= 45 && code <= 48) return "cloudy";
  if (code >= 51 && code <= 67) return "rainy";
  if (code >= 71 && code <= 77) return "rainy";
  if (code >= 80 && code <= 82) return "rainy";
  if (code >= 95 && code <= 99) return "stormy";
  return "unknown";
}

function guessFromTime(): WeatherCondition {
  const h = new Date().getHours();
  if (h >= 12 && h <= 16) return "hot";
  if (h >= 17 && h <= 19) return "humid";
  return "clear";
}
