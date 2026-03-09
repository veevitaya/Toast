import { memo, useId, useEffect } from "react";

type IconName =
  | "fire" | "chili" | "cocktail" | "money" | "salad" | "umbrella"
  | "hearts" | "scooter" | "moon" | "cake" | "pancakes" | "noodles"
  | "city" | "family" | "coffee" | "sushi" | "burger" | "pizza"
  | "dumpling" | "egg" | "boba" | "croissant" | "plate" | "grid"
  | "sparkle" | "flag-th" | "more";

interface FoodIconProps {
  name: IconName;
  size?: number;
  className?: string;
}

type AnimType = "flicker" | "pulse" | "wobble" | "sway" | "float" | "bounce" | "wave" | "twinkle" | "jiggle";

const ANIM_MAP: Record<IconName, AnimType> = {
  fire: "flicker",
  chili: "sway",
  cocktail: "wobble",
  money: "jiggle",
  salad: "sway",
  umbrella: "wobble",
  hearts: "pulse",
  scooter: "bounce",
  moon: "float",
  cake: "wobble",
  pancakes: "jiggle",
  noodles: "sway",
  city: "twinkle",
  family: "sway",
  coffee: "float",
  sushi: "wobble",
  burger: "bounce",
  pizza: "wobble",
  dumpling: "float",
  egg: "jiggle",
  boba: "bounce",
  croissant: "sway",
  plate: "wobble",
  grid: "twinkle",
  sparkle: "flicker",
  "flag-th": "wave",
  more: "pulse",
};

let stylesInjected = false;
function injectAnimStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fi-flicker {
      0% { transform: scaleX(1) scaleY(1) rotate(0deg); }
      15% { transform: scaleX(0.88) scaleY(1.08) rotate(-3deg); }
      30% { transform: scaleX(1.08) scaleY(0.92) rotate(2deg); }
      45% { transform: scaleX(0.92) scaleY(1.06) rotate(-2deg); }
      60% { transform: scaleX(1.05) scaleY(0.95) rotate(3deg); }
      75% { transform: scaleX(0.94) scaleY(1.04) rotate(-1.5deg); }
      90% { transform: scaleX(1.02) scaleY(0.98) rotate(1deg); }
      100% { transform: scaleX(1) scaleY(1) rotate(0deg); }
    }
    @keyframes fi-pulse {
      0% { transform: scale(1); }
      30% { transform: scale(1.18); }
      60% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }
    @keyframes fi-wobble {
      0% { transform: rotate(0deg); }
      20% { transform: rotate(-6deg); }
      40% { transform: rotate(5deg); }
      60% { transform: rotate(-4deg); }
      80% { transform: rotate(3deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes fi-sway {
      0% { transform: rotate(0deg) translateX(0); }
      25% { transform: rotate(-5deg) translateX(-2px); }
      50% { transform: rotate(4deg) translateX(2px); }
      75% { transform: rotate(-3deg) translateX(-1px); }
      100% { transform: rotate(0deg) translateX(0); }
    }
    @keyframes fi-float {
      0% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
      60% { transform: translateY(1px); }
      100% { transform: translateY(0); }
    }
    @keyframes fi-bounce {
      0% { transform: translateY(0) scaleY(1); }
      25% { transform: translateY(-5px) scaleY(1.04); }
      50% { transform: translateY(0) scaleY(0.94); }
      75% { transform: translateY(-2px) scaleY(1.02); }
      100% { transform: translateY(0) scaleY(1); }
    }
    @keyframes fi-wave {
      0% { transform: rotate(0deg); }
      15% { transform: rotate(5deg); }
      30% { transform: rotate(-4deg); }
      50% { transform: rotate(5deg); }
      70% { transform: rotate(-3deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes fi-twinkle {
      0% { opacity: 1; transform: scale(1); }
      40% { opacity: 0.7; transform: scale(0.92); }
      70% { opacity: 1; transform: scale(1.05); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes fi-jiggle {
      0% { transform: rotate(0deg); }
      15% { transform: rotate(-4deg); }
      30% { transform: rotate(5deg); }
      45% { transform: rotate(-5deg); }
      60% { transform: rotate(4deg); }
      75% { transform: rotate(-2deg); }
      100% { transform: rotate(0deg); }
    }
    .fi-tap-flicker { animation: fi-flicker 0.5s ease-in-out forwards; transform-origin: center bottom; }
    .fi-tap-pulse { animation: fi-pulse 0.45s ease-in-out forwards; transform-origin: center center; }
    .fi-tap-wobble { animation: fi-wobble 0.5s ease-in-out forwards; transform-origin: center bottom; }
    .fi-tap-sway { animation: fi-sway 0.5s ease-in-out forwards; transform-origin: center bottom; }
    .fi-tap-float { animation: fi-float 0.5s ease-in-out forwards; transform-origin: center center; }
    .fi-tap-bounce { animation: fi-bounce 0.45s ease-in-out forwards; transform-origin: center bottom; }
    .fi-tap-wave { animation: fi-wave 0.5s ease-in-out forwards; transform-origin: left center; }
    .fi-tap-twinkle { animation: fi-twinkle 0.45s ease-in-out forwards; transform-origin: center center; }
    .fi-tap-jiggle { animation: fi-jiggle 0.4s ease-in-out forwards; transform-origin: center center; }
  `;
  document.head.appendChild(style);
}

const icons: Record<IconName, (s: number, u: string) => JSX.Element> = {
  fire: (s, u) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id={`fg1_${u}`} x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFEE58" />
          <stop offset="50%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#FF6F00" />
        </linearGradient>
      </defs>
      <path d="M32 4C24 18 12 26 12 40c0 13 9 22 20 22s20-9 20-22C52 26 40 18 32 4z" fill={`url(#fg1_${u})`} />
      <path d="M32 24c-4 6-12 12-12 22c0 8 5.5 14 12 14s12-6 12-14c0-10-8-16-12-22z" fill="#FF6F00" />
      <path d="M32 38c-2 4-6 7-6 12c0 4.5 2.7 7 6 7s6-2.5 6-7c0-5-4-8-6-12z" fill="#E53935" />
      <ellipse cx="30" cy="44" rx="2" ry="3" fill="#FFAB40" opacity="0.5" />
    </svg>
  ),
  chili: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M24 16 Q22 10 24 6" stroke="#2E9E8F" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M20 20 C21 16 25 14 30 14 C34 14 36 16 35 20 Z" fill="#2E9E8F" />
      <path d="M20 20 C16 26 12 36 16 44 C18 48 22 50 26 50 C32 50 38 46 44 38 C50 30 54 22 52 16 C50 12 46 12 42 14 C38 16 34 18 28 18 C24 18 21 19 20 20 Z" fill="#EF4836" />
      <path d="M22 22 C18 28 15 36 18 44 C20 48 24 49 27 48 C32 46 38 42 42 36 C48 28 50 20 48 16" fill="#E53935" />
    </svg>
  ),
  cocktail: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="60" rx="11" ry="2.5" fill="#B0BEC5" />
      <rect x="30.5" y="38" width="3" height="22" rx="1.5" fill="#CFD8DC" />
      <path d="M8 12h48L34 38h-4L8 12z" fill="#E8F5E9" opacity="0.7" />
      <path d="M12 12h40L34 36h-4L12 12z" fill="#81D4FA" opacity="0.45" />
      <path d="M8 12h48v2H8z" fill="#90CAF9" opacity="0.3" />
      <rect x="30" y="6" width="2" height="10" rx="1" fill="#BDBDBD" />
      <path d="M26 2h12l-2 4H28z" fill="#EF5350" />
      <circle cx="20" cy="24" r="2" fill="#FFEB3B" opacity="0.6" />
      <circle cx="28" cy="20" r="1.5" fill="#FF80AB" opacity="0.5" />
      <circle cx="36" cy="26" r="1.8" fill="#A5D6A7" opacity="0.5" />
      <circle cx="44" cy="10" r="5" fill="#FF7043" />
      <path d="M44 6c2-2 6-2 6 1s-3 2-4 3" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="42" cy="10" rx="1.5" ry="2" fill="#FFAB91" opacity="0.5" />
    </svg>
  ),
  money: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M8 18h48v32c0 3-4 6-8 6H16c-4 0-8-3-8-6V18z" fill="#43A047" />
      <path d="M8 16h48v32c0 3-4 6-8 6H16c-4 0-8-3-8-6V16z" fill="#66BB6A" />
      <rect x="8" y="14" width="48" height="6" rx="3" fill="#81C784" />
      <circle cx="32" cy="36" r="10" fill="#A5D6A7" opacity="0.6" />
      <circle cx="32" cy="36" r="7" fill="#C8E6C9" opacity="0.5" />
      <text x="32" y="41" textAnchor="middle" fill="white" fontWeight="900" fontSize="16" fontFamily="system-ui">$</text>
      <rect x="14" y="22" width="6" height="3" rx="1.5" fill="#81C784" opacity="0.5" />
      <rect x="44" y="22" width="6" height="3" rx="1.5" fill="#81C784" opacity="0.5" />
      <rect x="14" y="46" width="6" height="3" rx="1.5" fill="#4CAF50" opacity="0.5" />
      <rect x="44" y="46" width="6" height="3" rx="1.5" fill="#4CAF50" opacity="0.5" />
    </svg>
  ),
  salad: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M4 38c0 0 4 20 28 20s28-20 28-20H4z" fill="#8D6E63" />
      <path d="M4 36c0 0 4 20 28 20s28-20 28-20H4z" fill="#A1887F" />
      <ellipse cx="32" cy="36" rx="28" ry="4" fill="#BCAAA4" />
      <ellipse cx="18" cy="30" rx="10" ry="7" fill="#388E3C" />
      <ellipse cx="18" cy="28" rx="10" ry="7" fill="#43A047" />
      <ellipse cx="44" cy="28" rx="10" ry="7" fill="#2E7D32" />
      <ellipse cx="44" cy="26" rx="10" ry="7" fill="#43A047" />
      <ellipse cx="30" cy="24" rx="9" ry="6" fill="#4CAF50" />
      <ellipse cx="30" cy="22" rx="9" ry="6" fill="#66BB6A" />
      <path d="M22 22c2-3 5-4 8-3" stroke="#A5D6A7" strokeWidth="1.2" opacity="0.5" fill="none" />
      <path d="M38 20c2-2 5-3 7-2" stroke="#A5D6A7" strokeWidth="1.2" opacity="0.5" fill="none" />
      <circle cx="22" cy="26" r="3.5" fill="#E53935" />
      <circle cx="38" cy="22" r="3" fill="#E53935" />
      <circle cx="30" cy="30" r="2.5" fill="#FF9800" />
      <ellipse cx="42" cy="30" rx="2.5" ry="2" fill="#FDD835" />
      <circle cx="26" cy="18" r="2" fill="#E53935" opacity="0.6" />
    </svg>
  ),
  umbrella: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M4 34c0-16 12.5-28 28-28s28 12 28 28H4z" fill="#4A90D9" />
      <path d="M4 34l18-24c4 6 7 14 10 24H4z" fill="#5BA0E0" />
      <path d="M22 10l10 24l10-24c-3-3-6-4-10-4s-7 1-10 4z" fill="#FFC107" />
      <path d="M42 10l18 24H32l10-24z" fill="#F48FB1" />
      <path d="M4 34h56" stroke="#3B7DD8" strokeWidth="1.5" opacity="0.2" />
      <path d="M22 10c0 0 4 2 10 2s10-2 10-2" stroke="#E6A800" strokeWidth="1" opacity="0.3" fill="none" />
      <rect x="30.5" y="34" width="3" height="22" rx="1.5" fill="#CFD8DC" />
      <rect x="27" y="56" width="10" height="4" rx="2" fill="#B0BEC5" />
      <rect x="28.5" y="55" width="7" height="3" rx="1.5" fill="#CFD8DC" />
    </svg>
  ),
  hearts: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M22 52l-16-20c-3-5-3-13 3-18c5-4 11-2 15 3c4-5 10-7 15-3c6 5 6 13 3 18L22 52z" fill="#EC407A" />
      <path d="M22 48l-13-17c-2.5-4-2.5-10 2.5-14c4-3 9-2 12 2.5c3-4.5 8-5.5 12-2.5c5 4 5 10 2.5 14L22 48z" fill="#F06292" />
      <ellipse cx="13" cy="24" rx="4" ry="5" fill="#F8BBD0" opacity="0.4" />
      <path d="M44 44l-12-14c-2-3-2-8 2-11c3-2 7-1 9 2c2-3 6-4 9-2c4 3 4 8 2 11L44 44z" fill="#E91E63" />
      <path d="M44 41l-9-11c-1.5-2-1.5-6 1.5-8c2.5-2 5.5-0.8 7 1.5c1.5-2.3 4.5-3.5 7-1.5c3 2 3 6 1.5 8L44 41z" fill="#F06292" />
      <ellipse cx="38" cy="28" rx="2.5" ry="3" fill="#F8BBD0" opacity="0.35" />
    </svg>
  ),
  scooter: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M14 16h18c2 0 4 1.5 4 3.5v22c0 2-1.5 3.5-3.5 3.5H14c-2 0-3.5-1.5-3.5-3.5v-22c0-2 1.5-3.5 3.5-3.5z" fill="#FF7043" />
      <path d="M14 14h18c2 0 4 1.5 4 3.5v22c0 2-1.5 3.5-3.5 3.5H14c-2 0-3.5-1.5-3.5-3.5v-22c0-2 1.5-3.5 3.5-3.5z" fill="#FF8A65" />
      <rect x="14" y="18" width="18" height="3" rx="1.5" fill="#FFAB91" opacity="0.6" />
      <path d="M36 20l14-8" stroke="#90A4AE" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 30l14 0" stroke="#90A4AE" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="12" r="6" fill="#42A5F5" />
      <circle cx="50" cy="12" r="3.5" fill="#64B5F6" />
      <circle cx="50" cy="30" r="6" fill="#42A5F5" />
      <circle cx="50" cy="30" r="3.5" fill="#64B5F6" />
      <rect x="8" y="42" width="30" height="3" rx="1.5" fill="#FFAB91" />
      <path d="M4 52h10" stroke="#E0E0E0" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 4" />
      <path d="M4 56h16" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 4" />
      <path d="M4 48h6" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 4" />
    </svg>
  ),
  moon: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id={`mg_${s}`} x1="10" y1="8" x2="50" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#FFD54F" />
        </linearGradient>
      </defs>
      <circle cx="28" cy="32" r="22" fill={`url(#mg_${s})`} />
      <circle cx="38" cy="22" r="16" fill="#1A1A2E" />
      <circle cx="22" cy="26" r="3" fill="#FFE082" opacity="0.3" />
      <circle cx="18" cy="38" r="2" fill="#FFE082" opacity="0.2" />
      <circle cx="30" cy="42" r="2.5" fill="#FFE082" opacity="0.2" />
      <circle cx="52" cy="10" r="2.5" fill="#FFF9C4" />
      <path d="M52 6v8M48 10h8" stroke="#FFF9C4" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="12" r="1.5" fill="#FFE082" opacity="0.6" />
      <circle cx="56" cy="40" r="1.5" fill="#FFE082" opacity="0.5" />
      <circle cx="48" cy="52" r="2" fill="#FFE082" opacity="0.4" />
      <path d="M46 48v8M42 52h8" stroke="#FFE082" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
  cake: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M20 60c0-3-6-4-6-14c0-8 4-14 10-20l8 0c6 6 10 12 10 20c0 10-6 11-6 14H20z" fill="#FFCCBC" />
      <path d="M22 60c0-3-4-5-4-14c0-7 3-12 8-18h4c5 6 8 11 8 18c0 9-4 11-4 14H22z" fill="#FFE0B2" />
      <circle cx="32" cy="14" r="12" fill="#F06292" />
      <circle cx="32" cy="12" r="12" fill="#F48FB1" />
      <circle cx="32" cy="11" r="8" fill="#F8BBD0" opacity="0.5" />
      <ellipse cx="28" cy="8" rx="3" ry="2.5" fill="#FCE4EC" opacity="0.5" />
      <circle cx="22" cy="40" r="3" fill="#CE93D8" opacity="0.5" />
      <circle cx="36" cy="36" r="2.5" fill="#81D4FA" opacity="0.4" />
      <circle cx="28" cy="48" r="2" fill="#A5D6A7" opacity="0.4" />
      <rect x="30" y="0" width="4" height="6" rx="2" fill="#8D6E63" />
    </svg>
  ),
  pancakes: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M6 36h24v20c0 3-5 6-12 6s-12-3-12-6V36z" fill="#F9A825" />
      <ellipse cx="18" cy="36" rx="12" ry="6" fill="#FDD835" />
      <ellipse cx="18" cy="35" rx="9" ry="4" fill="#FFF176" opacity="0.5" />
      <circle cx="18" cy="34" r="6" fill="#FF8F00" />
      <circle cx="18" cy="33" r="6" fill="#FFB300" />
      <circle cx="18" cy="32" r="3.5" fill="#FFD54F" />
      <ellipse cx="16" cy="30" rx="1.5" ry="2" fill="#FFF9C4" opacity="0.5" />
      <rect x="36" y="10" width="22" height="14" rx="4" fill="#8D6E63" />
      <rect x="36" y="8" width="22" height="14" rx="4" fill="#A1887F" />
      <rect x="38" y="10" width="18" height="10" rx="3" fill="#D7CCC8" />
      <rect x="40" y="12" width="14" height="6" rx="2" fill="#EFEBE9" />
      <path d="M50 22v6" stroke="#FFB300" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="32" r="4" fill="#FFB300" />
      <circle cx="50" cy="31" r="4" fill="#FDD835" />
      <path d="M44 22v4" stroke="#FFB300" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),
  noodles: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M6 40c0 0 4 18 26 18s26-18 26-18H6z" fill="#455A64" />
      <path d="M6 38c0 0 4 18 26 18s26-18 26-18H6z" fill="#546E7A" />
      <ellipse cx="32" cy="38" rx="26" ry="6" fill="#607D8B" />
      <path d="M14 36c3-4 5 2 8-2s4 3 7-1s5 3 8-1s5 2 7-2" stroke="#FFB74D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M16 32c3-3 4 2 7-2s4 3 6-1s5 2 7-1s4 2 6-2" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
      <ellipse cx="20" cy="26" rx="3.5" ry="3" fill="#E53935" />
      <ellipse cx="42" cy="24" rx="3" ry="2.5" fill="#66BB6A" />
      <ellipse cx="30" cy="22" rx="2.5" ry="2" fill="#FF7043" />
      <path d="M22 14c0-6 2-10 2-10" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M32 12c0-4 1-8 1-8" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
      <path d="M42 14c0-4-1-8-1-8" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
      <rect x="48" y="18" width="4" height="20" rx="2" fill="#8D6E63" />
      <rect x="54" y="16" width="4" height="22" rx="2" fill="#795548" />
    </svg>
  ),
  city: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 4l-3 8h6z" fill="#FF7043" />
      <rect x="28" y="12" width="8" height="46" rx="1" fill="#546E7A" />
      <rect x="29" y="12" width="6" height="46" rx="1" fill="#607D8B" />
      <rect x="4" y="28" width="14" height="30" rx="2" fill="#78909C" />
      <rect x="5" y="28" width="12" height="30" rx="2" fill="#90A4AE" />
      <rect x="18" y="22" width="12" height="36" rx="2" fill="#546E7A" />
      <rect x="19" y="22" width="10" height="36" rx="2" fill="#607D8B" />
      <rect x="36" y="24" width="12" height="34" rx="2" fill="#607D8B" />
      <rect x="37" y="24" width="10" height="34" rx="2" fill="#78909C" />
      <rect x="48" y="32" width="12" height="26" rx="2" fill="#78909C" />
      <rect x="49" y="32" width="10" height="26" rx="2" fill="#90A4AE" />
      <rect x="7" y="32" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.9" />
      <rect x="12" y="32" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.6" />
      <rect x="7" y="38" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.4" />
      <rect x="21" y="26" width="3" height="3" rx="0.5" fill="#FFF9C4" />
      <rect x="25" y="26" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.7" />
      <rect x="21" y="32" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.5" />
      <rect x="30" y="16" width="2.5" height="2.5" rx="0.5" fill="#FFF9C4" opacity="0.9" />
      <rect x="30" y="22" width="2.5" height="2.5" rx="0.5" fill="#FFF9C4" opacity="0.6" />
      <rect x="39" y="28" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.8" />
      <rect x="43" y="28" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.5" />
      <rect x="51" y="36" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.7" />
      <rect x="55" y="36" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.4" />
      <circle cx="52" cy="10" r="2" fill="#FFF9C4" opacity="0.3" />
      <circle cx="10" cy="16" r="1.5" fill="#FFF9C4" opacity="0.25" />
    </svg>
  ),
  family: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="52" rx="28" ry="8" fill="#EFEBE9" />
      <ellipse cx="32" cy="50" rx="26" ry="6" fill="#FFF3E0" />
      <circle cx="16" cy="18" r="8" fill="#FFCC80" />
      <ellipse cx="14" cy="15" rx="2" ry="2.5" fill="#FFE0B2" opacity="0.5" />
      <path d="M8 52V34c0-4 3.5-7 8-7s8 3 8 7v18" fill="#42A5F5" />
      <circle cx="48" cy="18" r="8" fill="#FFCC80" />
      <ellipse cx="46" cy="15" rx="2" ry="2.5" fill="#FFE0B2" opacity="0.5" />
      <path d="M40 52V34c0-4 3.5-7 8-7s8 3 8 7v18" fill="#EF5350" />
      <circle cx="32" cy="24" r="6.5" fill="#FFCC80" />
      <ellipse cx="30" cy="22" rx="1.5" ry="2" fill="#FFE0B2" opacity="0.5" />
      <path d="M25 52V38c0-3 3-5.5 7-5.5s7 2.5 7 5.5v14" fill="#66BB6A" />
      <circle cx="16" cy="14" r="3" fill="#8D6E63" />
      <path d="M12 12c0-3 2-5 4-5s4 2 4 5" fill="#A1887F" />
      <circle cx="48" cy="14" r="3" fill="#5D4037" />
      <path d="M44 12c0-3 2-5 4-5s4 2 4 5" fill="#6D4C41" />
    </svg>
  ),
  coffee: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M10 24h32v26c0 5-7 9-16 9s-16-4-16-9V24z" fill="#5D4037" />
      <path d="M10 22h32v26c0 5-7 9-16 9s-16-4-16-9V22z" fill="#6D4C41" />
      <ellipse cx="26" cy="22" rx="16" ry="5" fill="#4E342E" />
      <ellipse cx="26" cy="21" rx="13" ry="3.5" fill="#3E2723" />
      <ellipse cx="26" cy="21" rx="9" ry="2.5" fill="#5D4037" />
      <path d="M22 24c-2 4-4 8-2 14c1 3 4 5 6 5s5-2 6-5" stroke="#8D6E63" strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M42 28c4 0 10 3 10 8s-6 8-10 8" fill="#6D4C41" />
      <path d="M42 26c4 0 10 3 10 8s-6 8-10 8" fill="#795548" />
      <path d="M18 10c0-4 1.5-8 1.5-8" stroke="#BCAAA4" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
      <path d="M26 8c0-3 0.8-6 0.8-6" stroke="#BCAAA4" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
      <path d="M34 10c0-4-1.5-8-1.5-8" stroke="#BCAAA4" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  ),
  sushi: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="2" y="44" width="60" height="10" rx="5" fill="#8D6E63" />
      <rect x="2" y="42" width="60" height="8" rx="4" fill="#A1887F" />
      <ellipse cx="22" cy="40" rx="14" ry="10" fill="#263238" />
      <ellipse cx="22" cy="34" rx="14" ry="10" fill="#37474F" />
      <ellipse cx="22" cy="33" rx="11" ry="7" fill="white" />
      <ellipse cx="22" cy="32" rx="8.5" ry="5.5" fill="#FFCCBC" />
      <path d="M18 30c2-1 4-1 6 0c1 1 2 3 1 4s-3 1-5 0s-3-3-2-4z" fill="#E53935" />
      <ellipse cx="46" cy="38" rx="12" ry="9" fill="#263238" />
      <ellipse cx="46" cy="33" rx="12" ry="9" fill="#37474F" />
      <ellipse cx="46" cy="32" rx="9" ry="6.5" fill="white" />
      <ellipse cx="46" cy="31" rx="7" ry="5" fill="#FFCCBC" />
      <path d="M42 29c2-1 4-1 6 0c1 1 2 2.5 1 3.5s-3 1-5 0s-3-2.5-2-3.5z" fill="#FF7043" />
      <ellipse cx="22" cy="30" rx="3" ry="1.5" fill="#FFAB91" opacity="0.3" />
      <ellipse cx="46" cy="28" rx="2.5" ry="1.5" fill="#FFAB91" opacity="0.3" />
    </svg>
  ),
  burger: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M6 28c0-12 11.6-20 26-20s26 8 26 20H6z" fill="#E8A000" />
      <path d="M6 26c0-12 11.6-18 26-18s26 6 26 18H6z" fill="#F9A825" />
      <path d="M8 24c0-10 10.5-16 24-16s24 6 24 16" fill="#FDD835" />
      <ellipse cx="20" cy="16" rx="2.5" ry="1.5" fill="#FFF9C4" opacity="0.5" />
      <ellipse cx="34" cy="14" rx="2" ry="1.2" fill="#FFF9C4" opacity="0.4" />
      <ellipse cx="46" cy="17" rx="2" ry="1.2" fill="#FFF9C4" opacity="0.35" />
      <path d="M4 28h56c0 0-2 3-6 4H10c-4-1-6-4-6-4z" fill="#43A047" />
      <path d="M4 26h56c0 0-2 3-6 4H10c-4-1-6-4-6-4z" fill="#66BB6A" />
      <path d="M6 32h52v5H6z" fill="#F9A825" />
      <path d="M6 30h52v4H6z" fill="#FDD835" />
      <path d="M8 36h48v5c0 1-2 2-4 2H12c-2 0-4-1-4-2v-5z" fill="#5D4037" />
      <path d="M8 34h48v4c0 1-2 2-4 2H12c-2 0-4-1-4-2v-4z" fill="#795548" />
      <ellipse cx="32" cy="50" rx="26" ry="7" fill="#E8A000" />
      <ellipse cx="32" cy="48" rx="26" ry="7" fill="#F9A825" />
      <ellipse cx="32" cy="47" rx="22" ry="5" fill="#FDD835" opacity="0.3" />
    </svg>
  ),
  pizza: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 6L4 56c0 2 12 5 28 5s28-3 28-5L32 6z" fill="#E8A000" />
      <path d="M32 10L8 52c0 0 10 5 24 5s24-5 24-5L32 10z" fill="#F9A825" />
      <path d="M32 14L12 48c0 0 8 4 20 4s20-4 20-4L32 14z" fill="#FDD835" />
      <path d="M8 52c0 0 10 6 24 6s24-6 24-6" fill="#D4940A" strokeWidth="2" />
      <circle cx="26" cy="28" r="4.5" fill="#E53935" />
      <circle cx="38" cy="26" r="4" fill="#E53935" />
      <circle cx="28" cy="40" r="4" fill="#E53935" />
      <circle cx="40" cy="38" r="3.5" fill="#E53935" />
      <ellipse cx="22" cy="36" rx="3" ry="2.5" fill="#43A047" />
      <ellipse cx="34" cy="34" rx="2.5" ry="2" fill="#43A047" />
      <circle cx="26" cy="28" r="2" fill="#C62828" opacity="0.3" />
      <circle cx="38" cy="26" r="1.8" fill="#C62828" opacity="0.3" />
      <path d="M32 10c0 0 4 12 6 20" stroke="#FFE082" strokeWidth="1" opacity="0.3" />
    </svg>
  ),
  dumpling: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="52" rx="26" ry="8" fill="#8D6E63" />
      <path d="M6 40v12c0 0 10 8 26 8s26-8 26-8V40H6z" fill="#A1887F" />
      <ellipse cx="32" cy="40" rx="26" ry="8" fill="#BCAAA4" />
      <ellipse cx="32" cy="38" rx="26" ry="8" fill="#D7CCC8" />
      <ellipse cx="22" cy="34" rx="11" ry="9" fill="#FFF3E0" />
      <ellipse cx="22" cy="32" rx="11" ry="9" fill="#FFF8E1" />
      <path d="M14 28c2-1 5-2 8-1c3 1 5 3 6 5" stroke="#FFE0B2" strokeWidth="1.5" opacity="0.4" fill="none" />
      <ellipse cx="42" cy="32" rx="10" ry="8" fill="#FFF3E0" />
      <ellipse cx="42" cy="30" rx="10" ry="8" fill="#FFF8E1" />
      <path d="M34 26c2-1 4.5-1.5 7-0.5c2.5 1 4 3 5 4.5" stroke="#FFE0B2" strokeWidth="1.5" opacity="0.4" fill="none" />
    </svg>
  ),
  egg: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="42" rx="28" ry="16" fill="#455A64" />
      <ellipse cx="32" cy="40" rx="28" ry="16" fill="#546E7A" />
      <rect x="2" y="36" width="8" height="5" rx="2.5" fill="#546E7A" />
      <ellipse cx="32" cy="38" rx="22" ry="12" fill="#E0E0E0" />
      <ellipse cx="32" cy="36" rx="22" ry="12" fill="#F5F5F5" />
      <ellipse cx="32" cy="35" rx="18" ry="10" fill="white" />
      <circle cx="32" cy="32" r="10" fill="#F9A825" />
      <circle cx="32" cy="31" r="10" fill="#FDD835" />
      <circle cx="32" cy="30" r="7" fill="#FFF176" />
      <ellipse cx="29" cy="27" rx="3" ry="3.5" fill="#FFF9C4" opacity="0.5" />
    </svg>
  ),
  boba: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M18 18h28l-4 40c-0.5 3-5 5-10 5s-9.5-2-10-5L18 18z" fill="#CE93D8" opacity="0.4" />
      <path d="M18 16h28l-4 40c-0.5 3-5 5-10 5s-9.5-2-10-5L18 16z" fill="#E1BEE7" opacity="0.5" />
      <path d="M22 26h20l-3 28c-0.3 2-3.5 4-7 4s-6.7-2-7-4L22 26z" fill="#AB47BC" />
      <path d="M21 24h20l-3 28c-0.3 2-3.5 4-7 4s-6.7-2-7-4L21 24z" fill="#CE93D8" />
      <rect x="14" y="12" width="36" height="8" rx="4" fill="#7B1FA2" />
      <rect x="14" y="10" width="36" height="8" rx="4" fill="#9C27B0" />
      <rect x="30" y="0" width="4" height="14" rx="2" fill="#8D6E63" />
      <circle cx="28" cy="40" r="3.5" fill="#3E2723" />
      <circle cx="28" cy="39" r="3.5" fill="#4E342E" />
      <circle cx="36" cy="44" r="3" fill="#3E2723" />
      <circle cx="36" cy="43" r="3" fill="#4E342E" />
      <circle cx="30" cy="48" r="3" fill="#3E2723" />
      <circle cx="30" cy="47" r="3" fill="#5D4037" />
      <circle cx="37" cy="36" r="3.5" fill="#3E2723" />
      <circle cx="37" cy="35" r="3.5" fill="#4E342E" />
      <ellipse cx="28" cy="30" rx="4" ry="2" fill="#E1BEE7" opacity="0.3" />
    </svg>
  ),
  croissant: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M8 40c0-12 10-24 24-24s24 12 24 24c0 6-10 12-24 12S8 46 8 40z" fill="#D4940A" />
      <path d="M8 38c0-12 10-22 24-22s24 10 24 22c0 6-10 12-24 12S8 44 8 38z" fill="#E8A000" />
      <path d="M10 36c0-10 9.5-20 22-20s22 10 22 20c0 5-9 10-22 10S10 41 10 36z" fill="#F9A825" />
      <path d="M12 34c0-8 9-18 20-18s20 10 20 18" fill="#FDD835" />
      <path d="M16 32c4-8 10-14 16-14s12 6 16 14" fill="#FFF176" opacity="0.35" />
      <path d="M24 24c0 0 4 4 8 4s8-4 8-4" stroke="#E8A000" strokeWidth="1.5" opacity="0.5" fill="none" />
      <path d="M20 30c0 0 6 4 12 4s12-4 12-4" stroke="#E8A000" strokeWidth="1.5" opacity="0.4" fill="none" />
    </svg>
  ),
  plate: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="46" rx="28" ry="14" fill="#BDBDBD" />
      <ellipse cx="32" cy="44" rx="28" ry="14" fill="#E0E0E0" />
      <ellipse cx="32" cy="42" rx="28" ry="14" fill="#EEEEEE" />
      <ellipse cx="32" cy="41" rx="22" ry="10" fill="#F5F5F5" />
      <ellipse cx="32" cy="40" rx="16" ry="7" fill="#FAFAFA" />
      <rect x="17" y="6" width="4" height="24" rx="2" fill="#B0BEC5" />
      <rect x="16" y="4" width="4" height="24" rx="2" fill="#CFD8DC" />
      <ellipse cx="18" cy="4" rx="4.5" ry="3" fill="#CFD8DC" />
      <rect x="43" y="6" width="4" height="24" rx="2" fill="#B0BEC5" />
      <rect x="42" y="4" width="4" height="24" rx="2" fill="#CFD8DC" />
      <rect x="42" y="6" width="3.5" height="4.5" rx="1.75" fill="#CFD8DC" />
      <rect x="42" y="13" width="3.5" height="4.5" rx="1.75" fill="#CFD8DC" />
      <ellipse cx="32" cy="38" rx="6" ry="3" fill="#E0E0E0" opacity="0.3" />
    </svg>
  ),
  grid: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="5" y="7" width="24" height="22" rx="5" fill="#FFB74D" />
      <rect x="5" y="5" width="24" height="22" rx="5" fill="#FFCC80" />
      <rect x="35" y="7" width="24" height="22" rx="5" fill="#66BB6A" />
      <rect x="35" y="5" width="24" height="22" rx="5" fill="#81C784" />
      <rect x="5" y="37" width="24" height="22" rx="5" fill="#42A5F5" />
      <rect x="5" y="35" width="24" height="22" rx="5" fill="#64B5F6" />
      <rect x="35" y="37" width="24" height="22" rx="5" fill="#FF7043" />
      <rect x="35" y="35" width="24" height="22" rx="5" fill="#FF8A65" />
    </svg>
  ),
  more: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="16" cy="16" r="7" fill="#E0E0E0" />
      <circle cx="16" cy="16" r="5.5" fill="#EEEEEE" />
      <circle cx="48" cy="16" r="7" fill="#E0E0E0" />
      <circle cx="48" cy="16" r="5.5" fill="#EEEEEE" />
      <circle cx="16" cy="48" r="7" fill="#E0E0E0" />
      <circle cx="16" cy="48" r="5.5" fill="#EEEEEE" />
      <circle cx="48" cy="48" r="7" fill="#E0E0E0" />
      <circle cx="48" cy="48" r="5.5" fill="#EEEEEE" />
      <circle cx="32" cy="32" r="8" fill="#BDBDBD" />
      <circle cx="32" cy="32" r="6" fill="#E0E0E0" />
      <circle cx="32" cy="32" r="3" fill="#9E9E9E" />
      <path d="M32 26v12" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 32h12" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  sparkle: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 2L38 24h22l-18 13 7 22-17-13-17 13 7-22L4 24h22z" fill="#F9A825" />
      <path d="M32 6L37 24h18l-14.5 10.5 5.5 18L32 42l-14 10.5 5.5-18L9 24h18z" fill="#FDD835" />
      <path d="M32 14l3.5 12h12l-10 7 4 12-9.5-7-9.5 7 4-12-10-7h12z" fill="#FFF9C4" opacity="0.4" />
    </svg>
  ),
  "flag-th": (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="6" width="4" height="52" rx="2" fill="#757575" />
      <rect x="7" y="4" width="4" height="52" rx="2" fill="#9E9E9E" />
      <circle cx="9" cy="6" r="3.5" fill="#F9A825" />
      <circle cx="8.5" cy="4" r="3.5" fill="#FDD835" />
      <rect x="12" y="10" width="46" height="34" rx="3" fill="#B71C1C" />
      <rect x="11" y="8" width="46" height="34" rx="3" fill="#E53935" />
      <rect x="11" y="13.5" width="46" height="6" fill="white" />
      <rect x="11" y="19.5" width="46" height="11" fill="#1A237E" />
      <rect x="11" y="30.5" width="46" height="6" fill="white" />
    </svg>
  ),
};

const EMOJI_TO_ICON: Record<string, IconName> = {
  "\uD83D\uDD25": "fire",
  "\uD83C\uDF36\uFE0F": "chili",
  "\uD83C\uDF36": "chili",
  "\uD83C\uDF78": "cocktail",
  "\uD83D\uDCB0": "money",
  "\uD83E\uDD57": "salad",
  "\u26F1\uFE0F": "umbrella",
  "\u26F1": "umbrella",
  "\uD83D\uDC95": "hearts",
  "\uD83D\uDEF5": "scooter",
  "\uD83C\uDF19": "moon",
  "\uD83C\uDF70": "cake",
  "\uD83E\uDD5E": "pancakes",
  "\uD83C\uDF5C": "noodles",
  "\uD83C\uDFD9\uFE0F": "city",
  "\uD83C\uDFD9": "city",
  "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67": "family",
  "\u2615": "coffee",
  "\u2615\uFE0F": "coffee",
  "\uD83C\uDF63": "sushi",
  "\uD83C\uDF54": "burger",
  "\uD83C\uDF55": "pizza",
  "\uD83E\uDD5F": "dumpling",
  "\uD83C\uDF73": "egg",
  "\uD83E\uDDCB": "boba",
  "\uD83E\uDD50": "croissant",
  "\uD83C\uDF7D\uFE0F": "plate",
  "\uD83C\uDF7D": "plate",
  "\uD83C\uDDF9\uD83C\uDDED": "flag-th",
  "\uD83C\uDF3E": "salad",
  "\uD83E\uDD6C": "salad",
  "\uD83C\uDF5D": "noodles",
  "\uD83C\uDF58": "pizza",
  "\uD83D\uDD1C": "sparkle",
  "\u2728": "sparkle",
  "\uD83C\uDF5B": "noodles",
  "\uD83C\uDF5E": "croissant",
  "\uD83C\uDF4E": "salad",
  "\uD83E\uDDC1": "cake",
};

export function emojiToIconName(emoji: string): IconName | null {
  return EMOJI_TO_ICON[emoji] || null;
}

export function getAnimClass(name: IconName): string {
  return `fi-tap-${ANIM_MAP[name]}`;
}

export const FoodIcon = memo(function FoodIcon({ name, size = 32, className = "" }: FoodIconProps) {
  const uid = useId().replace(/:/g, "");
  const renderIcon = icons[name];

  useEffect(() => {
    injectAnimStyles();
  }, []);

  if (!renderIcon) return null;

  return (
    <span
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      data-anim-class={`fi-tap-${ANIM_MAP[name]}`}
    >
      {renderIcon(size, uid)}
    </span>
  );
});

export function FoodIconFromEmoji({ emoji, size = 32, className = "" }: { emoji: string; size?: number; className?: string }) {
  const iconName = emojiToIconName(emoji);
  if (iconName) {
    return <FoodIcon name={iconName} size={size} className={className} />;
  }
  return <span className={`text-[${size * 0.7}px] select-none ${className}`}>{emoji}</span>;
}

export default FoodIcon;
