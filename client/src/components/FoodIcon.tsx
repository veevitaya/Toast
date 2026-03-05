import { memo } from "react";

type IconName =
  | "fire" | "chili" | "cocktail" | "money" | "salad" | "umbrella"
  | "hearts" | "scooter" | "moon" | "cake" | "pancakes" | "noodles"
  | "city" | "family" | "coffee" | "sushi" | "burger" | "pizza"
  | "dumpling" | "egg" | "boba" | "croissant" | "plate" | "grid"
  | "sparkle" | "flag-th";

interface FoodIconProps {
  name: IconName;
  size?: number;
  className?: string;
}

const icons: Record<IconName, (s: number) => JSX.Element> = {
  fire: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="fire-g" x1="24" y1="44" x2="24" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF4500" />
          <stop offset="0.5" stopColor="#FF8C00" />
          <stop offset="1" stopColor="#FFD700" />
        </linearGradient>
      </defs>
      <path d="M24 4c0 0-12 14-12 26c0 6.627 5.373 12 12 12s12-5.373 12-12C36 18 24 4 24 4z" fill="url(#fire-g)" />
      <ellipse cx="24" cy="36" rx="5" ry="7" fill="#FFEB3B" opacity="0.8" />
      <circle cx="18" cy="18" r="1.5" fill="white" opacity="0.7" />
      <path d="M16 17l1-2 1 1z" fill="white" opacity="0.5" />
    </svg>
  ),
  chili: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M22 6c-2 0-4 2-4 4h8c0-2-2-4-4-4z" fill="#4CAF50" />
      <path d="M24 10c2 0 6 4 8 14s-2 18-8 20c-6-2-10-10-8-20S22 10 24 10z" fill="#E53935" />
      <path d="M24 10c1 0 3 3 4 10s-1 14-4 16" fill="#C62828" opacity="0.4" />
      <ellipse cx="20" cy="18" rx="1.5" ry="2" fill="white" opacity="0.4" />
      <circle cx="19" cy="15" r="1" fill="white" opacity="0.5" />
    </svg>
  ),
  cocktail: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M12 10h24l-10 16v10h-4V26L12 10z" fill="#E8EAF6" />
      <path d="M12 10h24l-10 16h-4L12 10z" fill="#CE93D8" opacity="0.6" />
      <rect x="18" y="42" width="12" height="3" rx="1.5" fill="#9E9E9E" />
      <rect x="22" y="36" width="4" height="6" fill="#BDBDBD" />
      <circle cx="30" cy="8" r="3" fill="#FF7043" />
      <path d="M30 5v-2" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="32" cy="3" rx="2" ry="1.5" fill="#66BB6A" />
      <circle cx="16" cy="14" r="1" fill="white" opacity="0.5" />
    </svg>
  ),
  money: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="money-g" x1="14" y1="40" x2="34" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#43A047" />
          <stop offset="1" stopColor="#66BB6A" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="16" fill="url(#money-g)" />
      <circle cx="24" cy="24" r="12" fill="none" stroke="#A5D6A7" strokeWidth="1.5" opacity="0.6" />
      <text x="24" y="30" textAnchor="middle" fill="#E8F5E9" fontSize="18" fontWeight="bold" fontFamily="sans-serif">$</text>
      <circle cx="14" cy="12" r="1.5" fill="white" opacity="0.5" />
      <path d="M12 11l1.5-2.5 1 1.5z" fill="white" opacity="0.4" />
    </svg>
  ),
  salad: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="32" rx="16" ry="10" fill="#F5F5F5" />
      <ellipse cx="24" cy="30" rx="14" ry="8" fill="#FAFAFA" />
      <ellipse cx="20" cy="26" rx="6" ry="4" fill="#66BB6A" />
      <ellipse cx="28" cy="24" rx="5" ry="4" fill="#81C784" />
      <ellipse cx="24" cy="22" rx="4" ry="3" fill="#AED581" />
      <circle cx="22" cy="20" r="2.5" fill="#EF5350" />
      <circle cx="27" cy="22" r="2" fill="#FF8A65" />
      <ellipse cx="18" cy="24" rx="3" ry="2" fill="#43A047" />
      <circle cx="16" cy="22" r="1" fill="white" opacity="0.5" />
    </svg>
  ),
  umbrella: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M8 22c0-10 7.2-16 16-16s16 6 16 16H8z" fill="#FF7043" />
      <path d="M16 22c0-6 3.6-12 8-12" stroke="#FFB74D" strokeWidth="2" fill="none" opacity="0.4" />
      <path d="M24 22c0-6 3.6-12 8-12" stroke="#FFB74D" strokeWidth="2" fill="none" opacity="0.4" />
      <rect x="23" y="22" width="2" height="18" fill="#795548" rx="1" />
      <path d="M21 40c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2" fill="none" stroke="#795548" strokeWidth="2" />
      <circle cx="12" cy="14" r="1.2" fill="white" opacity="0.5" />
    </svg>
  ),
  hearts: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="heart-g" x1="10" y1="28" x2="38" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E91E63" />
          <stop offset="1" stopColor="#F48FB1" />
        </linearGradient>
      </defs>
      <path d="M24 42l-2-2C10 28 4 22 4 16c0-5.5 4.5-10 10-10 3.1 0 6.1 1.5 8 3.8h4c1.9-2.3 4.9-3.8 8-3.8 5.5 0 10 4.5 10 10 0 6-6 12-18 24l-2 2z" fill="url(#heart-g)" />
      <path d="M32 42l-1-1C22 32 18 28 18 24c0-3.3 2.7-6 6-6 1.9 0 3.7.9 4.8 2.3h2.4C32.3 18.9 34.1 18 36 18c3.3 0 6 2.7 6 6 0 4-4 8-10 16l-1 1z" fill="#F06292" opacity="0.6" />
      <circle cx="12" cy="14" r="1.5" fill="white" opacity="0.5" />
      <circle cx="16" cy="11" r="1" fill="white" opacity="0.4" />
    </svg>
  ),
  scooter: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="12" cy="38" r="6" fill="#616161" />
      <circle cx="12" cy="38" r="3" fill="#9E9E9E" />
      <circle cx="38" cy="38" r="6" fill="#616161" />
      <circle cx="38" cy="38" r="3" fill="#9E9E9E" />
      <path d="M12 32h10l6-12h8l2 6" stroke="#FF7043" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="26" y="16" width="12" height="8" rx="3" fill="#FF7043" />
      <rect x="18" y="26" width="8" height="6" rx="2" fill="#FF5722" />
      <rect x="28" y="10" width="4" height="8" rx="2" fill="#FFAB91" />
      <circle cx="20" cy="20" r="1" fill="white" opacity="0.5" />
    </svg>
  ),
  moon: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="moon-g" x1="10" y1="38" x2="38" y2="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFA726" />
          <stop offset="1" stopColor="#FFD54F" />
        </linearGradient>
      </defs>
      <path d="M34 8c-12 0-20 8-20 20s8 16 16 16c-2 0 8-4 8-16S38 8 34 8z" fill="url(#moon-g)" />
      <circle cx="28" cy="16" r="2" fill="#FFE082" opacity="0.5" />
      <circle cx="22" cy="28" r="1.5" fill="#FFE082" opacity="0.4" />
      <circle cx="18" cy="14" r="1" fill="white" opacity="0.6" />
      <path d="M16 12l1.5-2 1 1.5z" fill="white" opacity="0.4" />
    </svg>
  ),
  cake: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="24" width="32" height="16" rx="4" fill="#F48FB1" />
      <rect x="8" y="24" width="32" height="8" rx="4" fill="#F06292" />
      <rect x="12" y="18" width="24" height="8" rx="3" fill="#FFCC02" />
      <path d="M10 24c4-2 8 2 12-1s8 2 12-1 6 1 6 1" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
      <rect x="22" y="10" width="4" height="8" rx="2" fill="#FFE082" />
      <ellipse cx="24" cy="8" rx="3" ry="3" fill="#FF7043" />
      <ellipse cx="24" cy="6" rx="1.5" ry="2" fill="#FFAB91" opacity="0.6" />
      <circle cx="14" cy="22" r="1" fill="white" opacity="0.5" />
    </svg>
  ),
  pancakes: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="36" rx="16" ry="6" fill="#8D6E63" />
      <ellipse cx="24" cy="34" rx="16" ry="6" fill="#A1887F" />
      <ellipse cx="24" cy="30" rx="14" ry="5" fill="#BCAAA4" />
      <ellipse cx="24" cy="28" rx="14" ry="5" fill="#D7CCC8" />
      <ellipse cx="24" cy="24" rx="12" ry="4.5" fill="#BCAAA4" />
      <ellipse cx="24" cy="22" rx="12" ry="4.5" fill="#D7CCC8" />
      <ellipse cx="24" cy="20" rx="6" ry="2" fill="#FFB74D" opacity="0.7" />
      <ellipse cx="20" cy="18" rx="3" ry="4" fill="#FFB74D" opacity="0.4" />
      <rect x="28" y="14" width="3" height="8" rx="1.5" fill="#FFCC02" opacity="0.7" />
      <circle cx="16" cy="24" r="1" fill="white" opacity="0.4" />
    </svg>
  ),
  noodles: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="32" rx="16" ry="10" fill="#ECEFF1" />
      <ellipse cx="24" cy="30" rx="16" ry="10" fill="white" />
      <ellipse cx="24" cy="28" rx="12" ry="6" fill="#FFCC02" opacity="0.5" />
      <path d="M14 24c2 4 4-2 6 2s4-2 6 2 4-2 6 2" stroke="#FFAB00" strokeWidth="2" fill="none" />
      <path d="M16 28c2 3 3-1 5 2s3-2 5 1" stroke="#FF8F00" strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="20" cy="24" r="2.5" fill="#EF5350" />
      <circle cx="28" cy="22" r="2" fill="#66BB6A" />
      <path d="M30 16l2-8" stroke="#795548" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 16l2-8" stroke="#795548" strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="22" r="1" fill="white" opacity="0.5" />
    </svg>
  ),
  city: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect x="6" y="20" width="10" height="24" fill="#90A4AE" />
      <rect x="18" y="8" width="12" height="36" fill="#78909C" />
      <rect x="32" y="16" width="10" height="28" fill="#B0BEC5" />
      <rect x="8" y="24" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.8" />
      <rect x="12" y="24" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.6" />
      <rect x="20" y="12" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.8" />
      <rect x="25" y="12" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.6" />
      <rect x="20" y="18" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.7" />
      <rect x="34" y="20" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.8" />
      <rect x="34" y="26" width="3" height="3" rx="0.5" fill="#FFF9C4" opacity="0.5" />
      <circle cx="10" cy="18" r="1" fill="white" opacity="0.5" />
    </svg>
  ),
  family: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="16" cy="14" r="5" fill="#FFB74D" />
      <ellipse cx="16" cy="32" rx="7" ry="10" fill="#42A5F5" />
      <circle cx="32" cy="14" r="5" fill="#FFB74D" />
      <ellipse cx="32" cy="32" rx="7" ry="10" fill="#EF5350" />
      <circle cx="24" cy="20" r="3.5" fill="#FFD54F" />
      <ellipse cx="24" cy="34" rx="5" ry="8" fill="#66BB6A" />
      <circle cx="12" cy="10" r="1" fill="white" opacity="0.5" />
    </svg>
  ),
  coffee: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect x="10" y="16" width="22" height="24" rx="4" fill="#795548" />
      <rect x="10" y="16" width="22" height="12" rx="4" fill="#8D6E63" />
      <path d="M32 22h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4" fill="none" stroke="#A1887F" strokeWidth="3" />
      <rect x="8" y="14" width="26" height="4" rx="2" fill="#A1887F" />
      <path d="M18 10c0-2 1-3 1-5" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M22 8c0-2 1-3 1-5" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M26 10c0-2 1-3 1-5" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="14" cy="20" r="1.2" fill="white" opacity="0.4" />
    </svg>
  ),
  sushi: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="34" rx="16" ry="8" fill="#263238" />
      <rect x="8" y="18" width="32" height="16" rx="8" fill="#37474F" />
      <ellipse cx="24" cy="18" rx="16" ry="8" fill="#455A64" />
      <ellipse cx="24" cy="18" rx="12" ry="5.5" fill="white" />
      <ellipse cx="24" cy="17" rx="10" ry="4" fill="#FF8A65" />
      <ellipse cx="24" cy="16" rx="8" ry="3" fill="#EF5350" />
      <circle cx="16" cy="14" r="1" fill="white" opacity="0.6" />
      <path d="M14 13l1.5-2 1 1z" fill="white" opacity="0.4" />
    </svg>
  ),
  burger: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M8 24h32c0 0 0 6-16 6S8 24 8 24z" fill="#66BB6A" />
      <rect x="8" y="26" width="32" height="4" fill="#FFCC02" />
      <rect x="8" y="30" width="32" height="4" fill="#8D6E63" />
      <ellipse cx="24" cy="36" rx="16" ry="4" fill="#6D4C41" />
      <path d="M8 24c0-8 7.2-14 16-14s16 6 16 14H8z" fill="#D7A84E" />
      <path d="M8 24c0-8 7.2-14 16-14s16 6 16 14H8z" fill="#E8B960" opacity="0.5" />
      <ellipse cx="16" cy="18" rx="1" ry="0.8" fill="#F5E6C8" opacity="0.7" />
      <ellipse cx="22" cy="16" rx="0.8" ry="0.6" fill="#F5E6C8" opacity="0.6" />
      <ellipse cx="30" cy="18" rx="0.8" ry="0.6" fill="#F5E6C8" opacity="0.5" />
      <rect x="10" y="28" width="4" height="2" rx="1" fill="#EF5350" opacity="0.8" />
      <rect x="18" y="28" width="4" height="2" rx="1" fill="#EF5350" opacity="0.6" />
      <circle cx="12" cy="14" r="1.2" fill="white" opacity="0.5" />
    </svg>
  ),
  pizza: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M24 4L6 40c0 2.2 8 4 18 4s18-1.8 18-4L24 4z" fill="#FFB74D" />
      <path d="M24 4L6 40c0 0 8 3 18 3s18-3 18-3L24 4z" fill="#FFCC02" opacity="0.6" />
      <path d="M10 36c0 0 6 3 14 3s14-3 14-3" fill="#D7A84E" />
      <circle cx="20" cy="22" r="3" fill="#EF5350" />
      <circle cx="28" cy="18" r="2.5" fill="#EF5350" />
      <circle cx="22" cy="32" r="2.5" fill="#EF5350" />
      <ellipse cx="16" cy="28" rx="2" ry="1.5" fill="#66BB6A" />
      <ellipse cx="30" cy="28" rx="1.5" ry="1" fill="#66BB6A" />
      <circle cx="12" cy="18" r="1" fill="white" opacity="0.5" />
      <path d="M10 16l1.5-2 1 1.5z" fill="white" opacity="0.4" />
    </svg>
  ),
  dumpling: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="30" rx="16" ry="12" fill="#FFF3E0" />
      <ellipse cx="24" cy="28" rx="16" ry="12" fill="#FFE0B2" />
      <path d="M8 28c4-3 8 1 12-2s8 2 12-1c2-1.5 4 0 4 0" stroke="#FFB74D" strokeWidth="2" fill="none" opacity="0.4" />
      <ellipse cx="24" cy="26" rx="10" ry="6" fill="#FFCC80" opacity="0.3" />
      <circle cx="14" cy="22" r="1.2" fill="white" opacity="0.5" />
    </svg>
  ),
  egg: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="28" rx="16" ry="14" fill="white" />
      <ellipse cx="24" cy="28" rx="16" ry="14" fill="#F5F5F5" />
      <ellipse cx="24" cy="26" rx="14" ry="12" fill="white" />
      <circle cx="24" cy="26" r="8" fill="#FFCC02" />
      <circle cx="24" cy="24" r="6" fill="#FFD54F" />
      <circle cx="22" cy="22" r="2" fill="#FFE082" opacity="0.6" />
      <circle cx="16" cy="18" r="1" fill="white" opacity="0.5" />
    </svg>
  ),
  boba: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M14 14h20l-2 26c0 2-3.6 4-8 4s-8-2-8-4l-2-26z" fill="#E1BEE7" />
      <path d="M14 14h20l-1 14H15l-1-14z" fill="#CE93D8" opacity="0.5" />
      <rect x="12" y="10" width="24" height="6" rx="3" fill="#AB47BC" />
      <path d="M24 4v8" stroke="#795548" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="36" r="2.5" fill="#5D4037" />
      <circle cx="26" cy="38" r="2" fill="#5D4037" />
      <circle cx="22" cy="40" r="2" fill="#5D4037" />
      <circle cx="28" cy="34" r="2.5" fill="#5D4037" />
      <circle cx="18" cy="18" r="1" fill="white" opacity="0.4" />
    </svg>
  ),
  croissant: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="crois-g" x1="10" y1="36" x2="38" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A1887F" />
          <stop offset="1" stopColor="#D7A84E" />
        </linearGradient>
      </defs>
      <path d="M8 28c0-8 6-16 16-16s16 8 16 16c0 4-6 8-16 8S8 32 8 28z" fill="url(#crois-g)" />
      <path d="M12 26c4-6 8-10 12-10s8 4 12 10" fill="#E8B960" opacity="0.5" />
      <path d="M14 30c2-1 4 1 6-0.5s4 1 6-0.5 4 1 4 1" stroke="#C8A44E" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="14" cy="22" r="1.2" fill="white" opacity="0.5" />
    </svg>
  ),
  plate: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="32" rx="18" ry="10" fill="#E0E0E0" />
      <ellipse cx="24" cy="30" rx="18" ry="10" fill="#EEEEEE" />
      <ellipse cx="24" cy="30" rx="12" ry="6" fill="#F5F5F5" />
      <path d="M18 20l-2-14" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 6h8" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 20v-14" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 6h4" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="26" r="1" fill="white" opacity="0.5" />
    </svg>
  ),
  grid: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect x="6" y="6" width="14" height="14" rx="4" fill="#90CAF9" />
      <rect x="28" y="6" width="14" height="14" rx="4" fill="#A5D6A7" />
      <rect x="6" y="28" width="14" height="14" rx="4" fill="#FFCC80" />
      <rect x="28" y="28" width="14" height="14" rx="4" fill="#EF9A9A" />
    </svg>
  ),
  sparkle: (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M24 4l3 14h14l-11 8 4 14-10-8-10 8 4-14L7 18h14l3-14z" fill="#FFCC02" />
      <path d="M24 12l1.5 7h7l-5.5 4 2 7-5-4-5 4 2-7-5.5-4h7l1.5-7z" fill="#FFD54F" opacity="0.6" />
    </svg>
  ),
  "flag-th": (s) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <rect x="6" y="8" width="36" height="32" rx="4" fill="#EF5350" />
      <rect x="6" y="13.3" width="36" height="5.3" fill="white" />
      <rect x="6" y="18.6" width="36" height="10.8" fill="#1A237E" />
      <rect x="6" y="29.4" width="36" height="5.3" fill="white" />
      <circle cx="12" cy="12" r="1" fill="white" opacity="0.4" />
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
};

export function emojiToIconName(emoji: string): IconName | null {
  return EMOJI_TO_ICON[emoji] || null;
}

export const FoodIcon = memo(function FoodIcon({ name, size = 32, className = "" }: FoodIconProps) {
  const renderIcon = icons[name];
  if (!renderIcon) return null;
  return (
    <span
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.1))" }}
    >
      {renderIcon(size)}
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
