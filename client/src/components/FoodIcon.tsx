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
  animate?: boolean;
}

type AnimType = "flicker" | "pulse" | "wobble" | "sway" | "float" | "bounce" | "wave" | "twinkle" | "jiggle";

const ANIM_MAP: Record<IconName, AnimType> = {
  fire: "flicker",
  chili: "sway",
  cocktail: "wobble",
  money: "jiggle",
  salad: "sway",
  umbrella: "float",
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
      0%, 100% { transform: scaleX(1) scaleY(1) rotate(0deg); }
      15% { transform: scaleX(0.92) scaleY(1.06) rotate(-2deg); }
      30% { transform: scaleX(1.05) scaleY(0.95) rotate(1.5deg); }
      45% { transform: scaleX(0.95) scaleY(1.04) rotate(-1deg); }
      60% { transform: scaleX(1.03) scaleY(0.97) rotate(2deg); }
      75% { transform: scaleX(0.97) scaleY(1.03) rotate(-1.5deg); }
      90% { transform: scaleX(1.02) scaleY(0.98) rotate(0.5deg); }
    }
    @keyframes fi-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes fi-wobble {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-4deg); }
      75% { transform: rotate(4deg); }
    }
    @keyframes fi-sway {
      0%, 100% { transform: rotate(0deg) translateX(0); }
      33% { transform: rotate(-3deg) translateX(-1px); }
      66% { transform: rotate(3deg) translateX(1px); }
    }
    @keyframes fi-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    @keyframes fi-bounce {
      0%, 100% { transform: translateY(0) scaleY(1); }
      40% { transform: translateY(-3px) scaleY(1.02); }
      60% { transform: translateY(0) scaleY(0.97); }
    }
    @keyframes fi-wave {
      0%, 100% { transform: rotate(0deg); }
      20% { transform: rotate(3deg); }
      40% { transform: rotate(-2deg); }
      60% { transform: rotate(3deg); }
      80% { transform: rotate(-1deg); }
    }
    @keyframes fi-twinkle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(0.96); }
    }
    @keyframes fi-jiggle {
      0%, 100% { transform: rotate(0deg); }
      20% { transform: rotate(-2deg); }
      40% { transform: rotate(3deg); }
      60% { transform: rotate(-3deg); }
      80% { transform: rotate(2deg); }
    }
    .fi-flicker { animation: fi-flicker 0.8s ease-in-out infinite; transform-origin: center bottom; }
    .fi-pulse { animation: fi-pulse 1.5s ease-in-out infinite; transform-origin: center center; }
    .fi-wobble { animation: fi-wobble 1.8s ease-in-out infinite; transform-origin: center bottom; }
    .fi-sway { animation: fi-sway 2s ease-in-out infinite; transform-origin: center bottom; }
    .fi-float { animation: fi-float 2.5s ease-in-out infinite; transform-origin: center center; }
    .fi-bounce { animation: fi-bounce 1.2s ease-in-out infinite; transform-origin: center bottom; }
    .fi-wave { animation: fi-wave 1.5s ease-in-out infinite; transform-origin: left center; }
    .fi-twinkle { animation: fi-twinkle 2s ease-in-out infinite; transform-origin: center center; }
    .fi-jiggle { animation: fi-jiggle 0.6s ease-in-out infinite; transform-origin: center center; }
  `;
  document.head.appendChild(style);
}

const icons: Record<IconName, (s: number, u: string) => JSX.Element> = {
  fire: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 2C28 14 14 24 14 40c0 12 8 20 18 20s18-8 18-20C50 24 36 14 32 2z" fill="#FBC02D" />
      <path d="M42 16c4 10 8 18 8 24c0 12-8 20-18 20c-6 0-12-4-15-10c2 4 7 6 12 6c10 0 18-8 18-20c0-6-2-12-5-20z" fill="#F9A825" />
      <path d="M32 28c-2 6-8 12-8 20c0 5 3.5 9 8 9s8-4 8-9c0-8-6-14-8-20z" fill="#FF6F00" />
      <path d="M32 38c-1 3-4 6-4 10c0 3 1.8 5 4 5s4-2 4-5c0-4-3-7-4-10z" fill="#E53935" />
    </svg>
  ),
  chili: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M30 8c0-3 2-5 5-4c3 1 4 4 2 7l-3 3" fill="#4CAF50" />
      <path d="M34 4c0-2 2-3 4-2s3 4 1 6" fill="#66BB6A" />
      <path d="M22 56c-2-6-2-14 0-24c2-12 7-22 14-28c4-3 7 0 5 5c-3 10-5 18-6 28c-1 8-2 14-5 18c-2 4-6 4-8 1z" fill="#F44336" />
      <path d="M26 56c-1-5-1-12 0-20c2-12 6-20 12-26" fill="#EF5350" opacity="0.5" />
      <ellipse cx="30" cy="30" rx="3.5" ry="10" fill="#FF8A80" opacity="0.3" />
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
      <path d="M6 34c0-16 11.6-28 26-28s26 12 26 28H6z" fill="#FF7043" />
      <path d="M32 6c14.4 0 26 12 26 28h-26V6z" fill="#FF8A65" opacity="0.5" />
      <rect x="30" y="34" width="4" height="24" rx="2" fill="#8D6E63" />
      <path d="M28 58c0-2.5 2-4.5 4.5-4.5S37 55.5 37 58" fill="#6D4C41" />
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
      <path d="M14 42h14l5-22h16" fill="none" />
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

export const FoodIcon = memo(function FoodIcon({ name, size = 32, className = "", animate = true }: FoodIconProps) {
  const uid = useId().replace(/:/g, "");
  const renderIcon = icons[name];

  useEffect(() => {
    if (animate) injectAnimStyles();
  }, [animate]);

  if (!renderIcon) return null;

  const animClass = animate ? `fi-${ANIM_MAP[name]}` : "";

  return (
    <span
      className={`inline-flex items-center justify-center select-none ${animClass} ${className}`}
      style={{ width: size, height: size }}
    >
      {renderIcon(size, uid)}
    </span>
  );
});

export function FoodIconFromEmoji({ emoji, size = 32, className = "", animate = true }: { emoji: string; size?: number; className?: string; animate?: boolean }) {
  const iconName = emojiToIconName(emoji);
  if (iconName) {
    return <FoodIcon name={iconName} size={size} className={className} animate={animate} />;
  }
  return <span className={`text-[${size * 0.7}px] select-none ${className}`}>{emoji}</span>;
}

export default FoodIcon;
