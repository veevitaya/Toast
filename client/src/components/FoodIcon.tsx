import { memo, useId, useEffect, useState, useCallback, useRef } from "react";

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
  fire: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 4c8 12 20 20 20 34c0 14-9 24-20 24S12 52 12 38C12 24 24 16 32 4z" fill="#FBC02D" />
      <path d="M44 18c5 8 8 16 8 20c0 14-9 24-20 24c-7 0-13-4-16-10c3 4 8 7 14 7c11 0 20-10 20-24c0-4-2-10-6-17z" fill="#F9A825" />
      <path d="M32 30c-3 5-10 10-10 18c0 7 4.5 12 10 12s10-5 10-12c0-8-7-13-10-18z" fill="#FF8F00" />
      <path d="M32 42c-1.5 3-5 6-5 10c0 4 2.2 6 5 6s5-2 5-6c0-4-3.5-7-5-10z" fill="#E53935" />
      <path d="M29 46c0 2 1.3 3.5 3 3.5s3-1.5 3-3.5" fill="#B71C1C" opacity="0.4" />
    </svg>
  ),
  chili: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 12c0 0-1-6 2-8c1.5-1 3 0 3 2s-2 5-2 5" fill="#26A69A" />
      <ellipse cx="33" cy="12" rx="3" ry="2.5" fill="#26A69A" />
      <path d="M30 14c-6 6-14 16-16 28c-1 6 1 10 4 12c4 2 8 0 10-4c4-8 6-16 8-24c1-4 0-8-2-10c-1-1-2-2-4-2z" fill="#F44336" />
      <path d="M30 14c-6 6-14 16-16 28c-1 6 1 10 4 12c4 2 8 0 10-4c4-8 6-16 8-24c1-4 0-8-2-10c-1-1-2-2-4-2z" fill="#EF5350" />
      <path d="M28 20c-4 6-10 14-12 24c-1 4 0 7 2 8" fill="#E53935" opacity="0.4" />
      <ellipse cx="26" cy="34" rx="4" ry="8" fill="#FF8A80" opacity="0.25" transform="rotate(-15 26 34)" />
    </svg>
  ),
  cocktail: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="58" rx="10" ry="3" fill="#BDBDBD" />
      <rect x="30" y="38" width="4" height="20" fill="#CFD8DC" />
      <path d="M10 10h44L34 38h-4L10 10z" fill="#E3F2FD" />
      <path d="M16 16h32l-12 22h-8z" fill="#F48FB1" opacity="0.6" />
      <circle cx="44" cy="8" r="6" fill="#FF8A65" />
      <ellipse cx="46" cy="3" rx="5" ry="3" fill="#66BB6A" />
    </svg>
  ),
  money: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="22" cy="40" r="16" fill="#F9A825" />
      <circle cx="22" cy="38" r="16" fill="#FDD835" />
      <circle cx="22" cy="38" r="11" fill="#FFF176" opacity="0.4" />
      <circle cx="22" cy="38" r="5" fill="#FFF9C4" opacity="0.3" />
      <circle cx="42" cy="30" r="16" fill="#F9A825" />
      <circle cx="42" cy="28" r="16" fill="#FFEE58" />
      <circle cx="42" cy="28" r="11" fill="#FFF9C4" opacity="0.4" />
      <circle cx="42" cy="28" r="5" fill="white" opacity="0.3" />
    </svg>
  ),
  salad: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="50" rx="26" ry="10" fill="#BCAAA4" />
      <ellipse cx="32" cy="48" rx="26" ry="10" fill="#D7CCC8" />
      <ellipse cx="32" cy="46" rx="26" ry="10" fill="#EFEBE9" />
      <ellipse cx="24" cy="38" rx="10" ry="8" fill="#43A047" />
      <ellipse cx="40" cy="36" rx="9" ry="7" fill="#66BB6A" />
      <ellipse cx="32" cy="34" rx="8" ry="6" fill="#81C784" />
      <circle cx="22" cy="32" r="4" fill="#E53935" />
      <circle cx="38" cy="30" r="3" fill="#FF9800" />
      <circle cx="42" cy="34" r="2.5" fill="#FDD835" />
    </svg>
  ),
  umbrella: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M4 34c0-16 12.5-28 28-28s28 12 28 28H4z" fill="#42A5F5" />
      <path d="M18 6c6 2 11 8 14 14l14-14c-4-4-10-6-14-6c-6 0-10 2-14 6z" fill="#42A5F5" />
      <path d="M32 6c-6 0-14 4-20 12l20 16V6z" fill="#64B5F6" opacity="0.3" />
      <path d="M14 26c2-8 8-16 18-20v28L14 26z" fill="#FDD835" />
      <path d="M32 6v28l18-8c2-6 0-12-4-16C42 6 38 4 32 6z" fill="#F48FB1" />
      <path d="M32 6c0 0-2 0-6 2c4-1 8 0 12 2C36 6 34 6 32 6z" fill="#FDD835" />
      <path d="M4 34h56" fill="none" />
      <ellipse cx="32" cy="34" rx="28" ry="2.5" fill="#1E88E5" opacity="0.15" />
      <rect x="30" y="34" width="4" height="26" rx="2" fill="#E0E0E0" />
      <rect x="26" y="58" width="12" height="4" rx="2" fill="#BDBDBD" />
      <rect x="28" y="56" width="8" height="4" rx="2" fill="#E0E0E0" />
    </svg>
  ),
  hearts: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 56L6 30C2 24 2 14 10 8c6-4 14-2 18 4h8c4-6 12-8 18-4c8 6 8 16 4 22L32 56z" fill="#E91E63" />
      <path d="M32 52L10 30c-3-4-4-12 2-16c4-3 10-2 14 2h12c4-4 10-5 14-2c6 4 5 12 2 16L32 52z" fill="#F06292" />
      <ellipse cx="18" cy="20" rx="5" ry="6" fill="#F8BBD0" opacity="0.4" />
    </svg>
  ),
  scooter: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="14" cy="50" r="10" fill="#546E7A" />
      <circle cx="14" cy="50" r="6" fill="#90A4AE" />
      <circle cx="14" cy="50" r="2" fill="#CFD8DC" />
      <circle cx="50" cy="50" r="10" fill="#546E7A" />
      <circle cx="50" cy="50" r="6" fill="#90A4AE" />
      <circle cx="50" cy="50" r="2" fill="#CFD8DC" />
      <path d="M14 42h14l5-22h16v6H38l-4 16H14z" fill="#FF7043" />
      <path d="M14 38h10l4-14h14v4H32l-3 10H14z" fill="#FF8A65" opacity="0.5" />
      <rect x="45" y="12" width="7" height="16" rx="3.5" fill="#FFAB91" />
    </svg>
  ),
  moon: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M44 6c-20 4-28 18-26 36c2 14 16 20 28 16c-6 2-12-1-18-6c-8-8-12-22-8-34C23 10 32 4 44 6z" fill="#F9A825" />
      <path d="M42 8c-18 4-24 16-22 32c1 10 10 16 20 14c-4 1-8-1-14-5c-8-6-12-20-8-30c2-6 10-10 16-13z" fill="#FDD835" />
      <circle cx="34" cy="20" r="2.5" fill="#FFF9C4" opacity="0.5" />
      <circle cx="26" cy="36" r="2" fill="#FFF9C4" opacity="0.4" />
      <circle cx="10" cy="14" r="2" fill="#FFF9C4" opacity="0.3" />
      <circle cx="54" cy="12" r="1.5" fill="#FFF9C4" opacity="0.2" />
    </svg>
  ),
  cake: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M8 38h48v20c0 2-10 4-24 4S8 60 8 58V38z" fill="#E91E63" />
      <rect x="8" y="36" width="48" height="6" rx="3" fill="#F06292" />
      <rect x="12" y="26" width="40" height="12" rx="4" fill="#FDD835" />
      <rect x="12" y="24" width="40" height="6" rx="3" fill="#FFF176" />
      <rect x="28" y="8" width="8" height="18" rx="4" fill="#FFF9C4" />
      <ellipse cx="32" cy="6" rx="5" ry="5" fill="#FF8A65" />
      <ellipse cx="32" cy="3" rx="2.5" ry="4" fill="#FDD835" opacity="0.6" />
    </svg>
  ),
  pancakes: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="54" rx="24" ry="7" fill="#8D6E63" />
      <ellipse cx="32" cy="52" rx="24" ry="7" fill="#A1887F" />
      <ellipse cx="32" cy="50" rx="24" ry="7" fill="#D7CCC8" />
      <ellipse cx="32" cy="42" rx="20" ry="6" fill="#8D6E63" />
      <ellipse cx="32" cy="40" rx="20" ry="6" fill="#A1887F" />
      <ellipse cx="32" cy="38" rx="20" ry="6" fill="#D7CCC8" />
      <ellipse cx="32" cy="30" rx="16" ry="5" fill="#8D6E63" />
      <ellipse cx="32" cy="28" rx="16" ry="5" fill="#A1887F" />
      <ellipse cx="32" cy="26" rx="16" ry="5" fill="#D7CCC8" />
      <ellipse cx="32" cy="24" rx="8" ry="3" fill="#FFB74D" opacity="0.5" />
      <rect x="40" y="12" width="6" height="18" rx="3" fill="#FDD835" />
    </svg>
  ),
  noodles: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="52" rx="28" ry="10" fill="#BCAAA4" />
      <ellipse cx="32" cy="50" rx="28" ry="10" fill="#D7CCC8" />
      <ellipse cx="32" cy="48" rx="28" ry="10" fill="#EFEBE9" />
      <ellipse cx="32" cy="42" rx="20" ry="8" fill="#FFF8E1" />
      <path d="M14 38c5 6 7-2 12 4s8-4 12 3c4-5 7 2 10 1" fill="#FFB74D" />
      <path d="M16 42c4 5 6-2 10 3s6-3 9 2c3-4 6 1 8 0" fill="#FF9800" opacity="0.5" />
      <circle cx="20" cy="36" r="4" fill="#E53935" />
      <circle cx="40" cy="34" r="3.5" fill="#43A047" />
      <rect x="44" y="16" width="4.5" height="22" rx="2.25" fill="#8D6E63" />
      <rect x="50" y="16" width="4.5" height="22" rx="2.25" fill="#8D6E63" />
    </svg>
  ),
  city: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="4" y="26" width="16" height="32" rx="2" fill="#78909C" />
      <rect x="4" y="24" width="16" height="32" rx="2" fill="#90A4AE" />
      <rect x="18" y="10" width="18" height="48" rx="2" fill="#546E7A" />
      <rect x="18" y="8" width="18" height="48" rx="2" fill="#607D8B" />
      <rect x="40" y="20" width="16" height="38" rx="2" fill="#90A4AE" />
      <rect x="40" y="18" width="16" height="38" rx="2" fill="#B0BEC5" />
      <rect x="7" y="30" width="4" height="4" rx="1" fill="#FFF9C4" />
      <rect x="13" y="30" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.7" />
      <rect x="7" y="38" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.5" />
      <rect x="22" y="14" width="4" height="4" rx="1" fill="#FFF9C4" />
      <rect x="29" y="14" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.7" />
      <rect x="22" y="22" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.8" />
      <rect x="29" y="22" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.5" />
      <rect x="44" y="24" width="4" height="4" rx="1" fill="#FFF9C4" />
      <rect x="50" y="24" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.6" />
    </svg>
  ),
  family: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="14" cy="16" r="9" fill="#FFB74D" />
      <circle cx="14" cy="14" r="9" fill="#FFCC80" />
      <path d="M4 56V32c0-5 4-9 10-9s10 4 10 9v24z" fill="#42A5F5" />
      <circle cx="50" cy="16" r="9" fill="#FFB74D" />
      <circle cx="50" cy="14" r="9" fill="#FFCC80" />
      <path d="M40 56V32c0-5 4-9 10-9s10 4 10 9v24z" fill="#F06292" />
      <circle cx="32" cy="24" r="7" fill="#FFB74D" />
      <circle cx="32" cy="22" r="7" fill="#FFCC80" />
      <path d="M24 58V38c0-4 3.5-7 8-7s8 3 8 7v20z" fill="#66BB6A" />
    </svg>
  ),
  coffee: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M6 24h36v28c0 4-8 7-18 7S6 56 6 52V24z" fill="#5D4037" />
      <path d="M6 22h36v28c0 4-8 7-18 7S6 54 6 50V22z" fill="#795548" />
      <rect x="6" y="18" width="36" height="8" rx="4" fill="#8D6E63" />
      <ellipse cx="24" cy="18" rx="18" ry="6" fill="#4E342E" />
      <ellipse cx="24" cy="17" rx="14" ry="4" fill="#3E2723" />
      <path d="M42 28c6 0 12 3.5 12 9s-6 9-12 9" fill="#795548" />
      <path d="M42 26c6 0 12 3.5 12 9s-6 9-12 9" fill="#8D6E63" />
      <ellipse cx="16" cy="10" rx="2.5" ry="5" fill="#D7CCC8" opacity="0.3" />
      <ellipse cx="24" cy="8" rx="2.5" ry="5" fill="#D7CCC8" opacity="0.25" />
      <ellipse cx="32" cy="10" rx="2.5" ry="5" fill="#D7CCC8" opacity="0.3" />
    </svg>
  ),
  sushi: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="2" y="46" width="60" height="8" rx="4" fill="#8D6E63" />
      <rect x="2" y="44" width="60" height="6" rx="3" fill="#A1887F" />
      <ellipse cx="20" cy="42" rx="14" ry="8" fill="#263238" />
      <ellipse cx="20" cy="36" rx="14" ry="8" fill="#37474F" />
      <ellipse cx="20" cy="35" rx="11" ry="6" fill="white" />
      <ellipse cx="20" cy="34" rx="8.5" ry="5" fill="#FFCCBC" />
      <ellipse cx="20" cy="33" rx="6" ry="3.5" fill="#E53935" />
      <ellipse cx="46" cy="40" rx="12" ry="7" fill="#263238" />
      <ellipse cx="46" cy="35" rx="12" ry="7" fill="#37474F" />
      <ellipse cx="46" cy="34" rx="9" ry="5" fill="white" />
      <ellipse cx="46" cy="33" rx="6.5" ry="4" fill="#FFCCBC" />
      <ellipse cx="46" cy="32" rx="4.5" ry="2.5" fill="#E53935" />
    </svg>
  ),
  burger: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M6 30c0-14 11.6-22 26-22s26 8 26 22H6z" fill="#F9A825" />
      <path d="M6 28c0-13 11.6-20 26-20s26 7 26 20H6z" fill="#FDD835" />
      <ellipse cx="20" cy="18" rx="2.5" ry="1.5" fill="#FFF9C4" opacity="0.4" />
      <ellipse cx="34" cy="14" rx="2" ry="1.2" fill="#FFF9C4" opacity="0.3" />
      <ellipse cx="46" cy="18" rx="2" ry="1.2" fill="#FFF9C4" opacity="0.3" />
      <rect x="4" y="30" width="56" height="5" rx="2" fill="#43A047" />
      <rect x="4" y="28" width="56" height="5" rx="2" fill="#66BB6A" />
      <rect x="4" y="33" width="56" height="4" rx="1" fill="#F9A825" />
      <rect x="4" y="31" width="56" height="4" rx="1" fill="#FDD835" />
      <rect x="4" y="35" width="56" height="6" rx="1" fill="#5D4037" />
      <rect x="4" y="33" width="56" height="6" rx="1" fill="#795548" />
      <ellipse cx="32" cy="50" rx="26" ry="6" fill="#F9A825" />
      <ellipse cx="32" cy="48" rx="26" ry="6" fill="#FDD835" />
    </svg>
  ),
  pizza: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 4L6 56c0 2 11 4 26 4s26-2 26-4L32 4z" fill="#F9A825" />
      <path d="M32 10L10 52c0 0 9 4 22 4s22-4 22-4L32 10z" fill="#FDD835" />
      <path d="M10 52c0 0 9 5 22 5s22-5 22-5" fill="#E8A000" />
      <circle cx="26" cy="28" r="5" fill="#E53935" />
      <circle cx="38" cy="24" r="4.5" fill="#E53935" />
      <circle cx="28" cy="42" r="4.5" fill="#E53935" />
      <circle cx="40" cy="38" r="4" fill="#E53935" />
      <ellipse cx="20" cy="38" rx="3.5" ry="3" fill="#43A047" />
      <ellipse cx="34" cy="34" rx="3" ry="2.5" fill="#43A047" />
    </svg>
  ),
  dumpling: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="54" rx="26" ry="8" fill="#8D6E63" />
      <path d="M6 40v14c0 0 10 8 26 8s26-8 26-8V40H6z" fill="#A1887F" />
      <ellipse cx="32" cy="40" rx="26" ry="8" fill="#BCAAA4" />
      <ellipse cx="32" cy="38" rx="26" ry="8" fill="#D7CCC8" />
      <ellipse cx="22" cy="34" rx="11" ry="9" fill="#FFF3E0" />
      <ellipse cx="22" cy="32" rx="11" ry="9" fill="#FFF8E1" />
      <ellipse cx="22" cy="30" rx="5.5" ry="3" fill="#FFE0B2" opacity="0.4" />
      <ellipse cx="42" cy="32" rx="10" ry="8" fill="#FFF3E0" />
      <ellipse cx="42" cy="30" rx="10" ry="8" fill="#FFF8E1" />
      <ellipse cx="42" cy="28" rx="5" ry="3" fill="#FFE0B2" opacity="0.4" />
    </svg>
  ),
  egg: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="44" rx="28" ry="14" fill="#455A64" />
      <ellipse cx="32" cy="42" rx="28" ry="14" fill="#546E7A" />
      <ellipse cx="32" cy="40" rx="28" ry="14" fill="#607D8B" />
      <rect x="1" y="36" width="9" height="6" rx="3" fill="#607D8B" />
      <ellipse cx="32" cy="38" rx="20" ry="11" fill="#E0E0E0" />
      <ellipse cx="32" cy="36" rx="20" ry="11" fill="white" />
      <circle cx="32" cy="34" r="9" fill="#F9A825" />
      <circle cx="32" cy="32" r="9" fill="#FDD835" />
      <circle cx="32" cy="31" r="6.5" fill="#FFF176" />
      <ellipse cx="29" cy="28" rx="3" ry="3.5" fill="#FFF9C4" opacity="0.4" />
    </svg>
  ),
  boba: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M16 20h32l-4 38c-0.5 3-6 5-12 5s-11.5-2-12-5L16 20z" fill="#CE93D8" opacity="0.5" />
      <path d="M16 18h32l-4 38c-0.5 3-6 5-12 5s-11.5-2-12-5L16 18z" fill="#E1BEE7" opacity="0.6" />
      <path d="M20 28h24l-3 26c-0.3 2-4.5 4-9 4s-8.7-2-9-4L20 28z" fill="#AB47BC" />
      <path d="M19 26h24l-3 26c-0.3 2-4.5 4-9 4s-8.7-2-9-4L19 26z" fill="#CE93D8" />
      <rect x="12" y="14" width="40" height="8" rx="4" fill="#7B1FA2" />
      <rect x="12" y="12" width="40" height="8" rx="4" fill="#9C27B0" />
      <rect x="29" y="0" width="6" height="16" rx="3" fill="#8D6E63" />
      <circle cx="26" cy="44" r="4" fill="#3E2723" />
      <circle cx="26" cy="43" r="4" fill="#4E342E" />
      <circle cx="34" cy="46" r="3.5" fill="#3E2723" />
      <circle cx="34" cy="45" r="3.5" fill="#4E342E" />
      <circle cx="28" cy="50" r="3.5" fill="#3E2723" />
      <circle cx="28" cy="49" r="3.5" fill="#5D4037" />
      <circle cx="36" cy="40" r="4" fill="#3E2723" />
      <circle cx="36" cy="39" r="4" fill="#4E342E" />
    </svg>
  ),
  croissant: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M8 42c0-14 10-26 24-26s24 12 24 26c0 7-10 14-24 14S8 49 8 42z" fill="#E8A000" />
      <path d="M8 40c0-14 10-24 24-24s24 10 24 24c0 7-10 14-24 14S8 47 8 40z" fill="#F9A825" />
      <path d="M8 38c0-13 10-22 24-22s24 9 24 22c0 6-10 12-24 12S8 44 8 38z" fill="#FDD835" />
      <path d="M14 34c6-10 10-16 18-16s12 6 18 16" fill="#FFF176" opacity="0.4" />
      <ellipse cx="20" cy="34" rx="4" ry="6" fill="#FFF176" opacity="0.2" />
    </svg>
  ),
  plate: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="48" rx="28" ry="12" fill="#BDBDBD" />
      <ellipse cx="32" cy="46" rx="28" ry="12" fill="#E0E0E0" />
      <ellipse cx="32" cy="44" rx="28" ry="12" fill="#EEEEEE" />
      <ellipse cx="32" cy="43" rx="20" ry="8" fill="#F5F5F5" />
      <ellipse cx="32" cy="42" rx="14" ry="5.5" fill="#FAFAFA" />
      <rect x="16" y="6" width="5" height="26" rx="2.5" fill="#B0BEC5" />
      <rect x="15" y="4" width="5" height="26" rx="2.5" fill="#CFD8DC" />
      <ellipse cx="17.5" cy="4" rx="5" ry="3.5" fill="#CFD8DC" />
      <rect x="43" y="6" width="5" height="26" rx="2.5" fill="#B0BEC5" />
      <rect x="42" y="4" width="5" height="26" rx="2.5" fill="#CFD8DC" />
      <rect x="42" y="6" width="4" height="5" rx="2" fill="#CFD8DC" />
      <rect x="42" y="14" width="4" height="5" rx="2" fill="#CFD8DC" />
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
      <circle cx="16" cy="18" r="9" fill="#D4944A" />
      <circle cx="16" cy="16" r="9" fill="#FFB74D" />
      <circle cx="48" cy="18" r="9" fill="#E8A000" />
      <circle cx="48" cy="16" r="9" fill="#FDD835" />
      <circle cx="16" cy="50" r="9" fill="#C2185B" />
      <circle cx="16" cy="48" r="9" fill="#F06292" />
      <circle cx="48" cy="50" r="9" fill="#2E7D32" />
      <circle cx="48" cy="48" r="9" fill="#66BB6A" />
      <circle cx="32" cy="34" r="5.5" fill="#BF360C" />
      <circle cx="32" cy="32" r="5.5" fill="#FF8A65" />
    </svg>
  ),
  sparkle: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 2l6 22h22l-18 13 7 22-17-13-17 13 7-22L4 24h22z" fill="#F9A825" />
      <path d="M32 4l5 20h20l-16 12 6 20-15-12-15 12 6-20L7 24h20z" fill="#FDD835" />
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
