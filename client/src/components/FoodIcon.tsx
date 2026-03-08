import { memo, useId } from "react";

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

const icons: Record<IconName, (s: number, u: string) => JSX.Element> = {
  fire: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 6c-2 6-14 18-14 32c0 10 6.3 18 14 18s14-8 14-18C46 24 34 12 32 6z" fill="#FF8A50" rx="99" />
      <path d="M32 24c-1 4-7 10-7 18c0 5 3.1 8 7 8s7-3 7-8c0-8-6-14-7-18z" fill="#FFD54F" />
      <ellipse cx="32" cy="44" rx="3.5" ry="4.5" fill="#FFF8E1" opacity="0.7" />
    </svg>
  ),
  chili: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M30 12c-1-2 0-4 2-5c2-1 4 0 4 2" fill="#4CAF50" />
      <path d="M33 9c1-3 3-5 5-4" stroke="#66BB6A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M20 46c3-22 7-30 14-34c3-1.5 5 1 4 5c-2 7-5 16-6 29" fill="#E53935" />
      <path d="M20 46c0 4 3 8 8 8h4c3 0 4-2 4-4" fill="#E53935" />
      <ellipse cx="25" cy="30" rx="2.5" ry="5" fill="#EF5350" opacity="0.5" />
    </svg>
  ),
  cocktail: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="56" rx="8" ry="2.5" fill="#BDBDBD" />
      <rect x="30" y="38" width="4" height="18" rx="2" fill="#E0E0E0" />
      <path d="M16 12h32L34 36h-4L16 12z" fill="#E8EAF6" opacity="0.85" />
      <path d="M20 18h24l-8 16h-8L20 18z" fill="#F48FB1" />
      <circle cx="40" cy="10" r="4.5" fill="#FF7043" />
      <path d="M40 6v-3" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="41" cy="3" rx="3" ry="2" fill="#66BB6A" />
    </svg>
  ),
  money: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="28" cy="40" rx="14" ry="10" fill="#D4A830" />
      <ellipse cx="28" cy="37" rx="14" ry="10" fill="#F0D060" />
      <text x="28" y="42" textAnchor="middle" fill="#8B6914" fontSize="14" fontWeight="bold" fontFamily="sans-serif">$</text>
      <ellipse cx="36" cy="32" rx="14" ry="10" fill="#DDB840" />
      <ellipse cx="36" cy="29" rx="14" ry="10" fill="#FFE082" />
      <text x="36" y="34" textAnchor="middle" fill="#8B6914" fontSize="14" fontWeight="bold" fontFamily="sans-serif">$</text>
    </svg>
  ),
  salad: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="44" rx="20" ry="12" fill="#E8E0D8" />
      <ellipse cx="32" cy="42" rx="20" ry="12" fill="#F5F0ED" />
      <ellipse cx="28" cy="34" rx="7" ry="5" fill="#66BB6A" />
      <ellipse cx="36" cy="32" rx="6" ry="5" fill="#43A047" />
      <ellipse cx="32" cy="30" rx="5" ry="3.5" fill="#8BC34A" />
      <circle cx="26" cy="28" r="3" fill="#F44336" />
      <circle cx="34" cy="30" r="2.5" fill="#FF9800" />
      <circle cx="38" cy="28" r="2" fill="#FFC107" />
    </svg>
  ),
  umbrella: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M10 30c0-13 9.8-22 22-22s22 9 22 22H10z" fill="#FF8A65" />
      <path d="M22 30c0-8 4.5-14 10-14" stroke="#FFE0B2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M32 30c0-8 4.5-14 10-14" stroke="#FFE0B2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="31" y="30" width="3" height="22" rx="1.5" fill="#8D6E63" />
      <path d="M29 52c0-2 1.3-3 3-3s3 1 3 3" fill="none" stroke="#6D4C41" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  hearts: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 54l-2.5-2.5C14 38 6 30 6 22c0-7.2 5.8-13 13-13 4 0 8 2 10.5 5h5C36.8 11 40.8 9 45 9c7.2 0 13 5.8 13 13 0 8-8 16-23.5 29.5L32 54z" fill="#F06292" />
      <path d="M44 50l-1-1C34 42 30 38 30 34c0-3.3 2.7-6 6-6 2 0 3.8 1 5 2.5C42.2 29 44 28 46 28c3.3 0 6 2.7 6 6 0 4-4 8-8 16z" fill="#F8BBD0" />
      <ellipse cx="20" cy="20" rx="4" ry="5" fill="#F8BBD0" opacity="0.4" />
    </svg>
  ),
  scooter: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="16" cy="50" r="7" fill="#546E7A" />
      <circle cx="16" cy="50" r="4" fill="#90A4AE" />
      <circle cx="50" cy="50" r="7" fill="#546E7A" />
      <circle cx="50" cy="50" r="4" fill="#90A4AE" />
      <path d="M16 43h14l8-16h10l3 8" stroke="#FF7043" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="36" y="24" width="14" height="10" rx="5" fill="#FF7043" />
      <rect x="24" y="36" width="10" height="8" rx="4" fill="#E64A19" />
    </svg>
  ),
  moon: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M42 10c-16 2-24 14-22 28s14 20 26 18c-4 2-10 0-16-4c-8-6-12-18-8-28c2-6 8-12 16-14z" fill="#FFC107" />
      <circle cx="36" cy="22" r="2.5" fill="#FFE082" opacity="0.6" />
      <circle cx="28" cy="38" r="2" fill="#FFE082" opacity="0.5" />
      <circle cx="14" cy="20" r="1.5" fill="#FFF9C4" opacity="0.6" />
      <circle cx="12" cy="38" r="1" fill="#FFF9C4" opacity="0.5" />
      <circle cx="50" cy="16" r="1" fill="#FFF9C4" opacity="0.4" />
    </svg>
  ),
  cake: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="10" y="36" width="44" height="18" rx="5" fill="#E91E63" />
      <path d="M12 36c5-3 10 2 16-1s10 3 14-1c2-1 4 0 4 0" stroke="white" strokeWidth="3" fill="none" opacity="0.4" />
      <rect x="14" y="24" width="36" height="14" rx="4" fill="#FFCC02" />
      <rect x="28" y="12" width="5" height="14" rx="2.5" fill="#FFF9C4" />
      <ellipse cx="30.5" cy="10" rx="4" ry="4" fill="#FF7043" />
      <ellipse cx="30" cy="7" rx="1.2" ry="2.5" fill="#FFCC02" opacity="0.8" />
    </svg>
  ),
  pancakes: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="48" rx="20" ry="7" fill="#D7CCC8" />
      <ellipse cx="32" cy="46" rx="16" ry="5.5" fill="#BCAAA4" />
      <ellipse cx="32" cy="44" rx="16" ry="5.5" fill="#D7CCC8" />
      <ellipse cx="32" cy="40" rx="14" ry="5" fill="#BCAAA4" />
      <ellipse cx="32" cy="38" rx="14" ry="5" fill="#D7CCC8" />
      <ellipse cx="32" cy="34" rx="12" ry="4.5" fill="#BCAAA4" />
      <ellipse cx="32" cy="32" rx="12" ry="4.5" fill="#D7CCC8" />
      <ellipse cx="32" cy="30" rx="7" ry="2.5" fill="#FFB74D" opacity="0.7" />
      <rect x="36" y="22" width="4" height="12" rx="2" fill="#FFCC02" opacity="0.7" />
    </svg>
  ),
  noodles: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="44" rx="22" ry="12" fill="#EEEEEE" />
      <ellipse cx="32" cy="42" rx="22" ry="12" fill="#F5F5F5" />
      <ellipse cx="32" cy="38" rx="16" ry="7" fill="#FFF8E1" />
      <path d="M18 34c3 5 5-2 8 3s5-3 8 2 5-2 7 2" stroke="#FFB300" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M20 38c2 4 4-2 6 2s4-2 6 1.5 3-1 5 1" stroke="#FF8F00" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
      <circle cx="24" cy="32" r="3" fill="#F44336" />
      <circle cx="36" cy="30" r="2.5" fill="#66BB6A" />
      <path d="M40 26l3-14" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 26l3-14" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  city: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="4" y="26" width="14" height="28" rx="2" fill="#90A4AE" />
      <rect x="20" y="10" width="16" height="44" rx="2" fill="#607D8B" />
      <rect x="40" y="20" width="14" height="34" rx="2" fill="#B0BEC5" />
      <rect x="7" y="30" width="3" height="3" rx="1" fill="#FFF9C4" />
      <rect x="12" y="30" width="3" height="3" rx="1" fill="#FFF9C4" opacity="0.7" />
      <rect x="7" y="36" width="3" height="3" rx="1" fill="#FFF9C4" opacity="0.6" />
      <rect x="23" y="14" width="3" height="3" rx="1" fill="#FFF9C4" />
      <rect x="29" y="14" width="3" height="3" rx="1" fill="#FFF9C4" opacity="0.7" />
      <rect x="23" y="20" width="3" height="3" rx="1" fill="#FFF9C4" opacity="0.8" />
      <rect x="29" y="20" width="3" height="3" rx="1" fill="#FFF9C4" opacity="0.6" />
      <rect x="43" y="24" width="3" height="3" rx="1" fill="#FFF9C4" />
      <rect x="49" y="24" width="3" height="3" rx="1" fill="#FFF9C4" opacity="0.6" />
    </svg>
  ),
  family: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="18" cy="18" r="7" fill="#FFCC80" />
      <ellipse cx="18" cy="40" rx="9" ry="14" fill="#64B5F6" />
      <circle cx="46" cy="18" r="7" fill="#FFCC80" />
      <ellipse cx="46" cy="40" rx="9" ry="14" fill="#EF5350" />
      <circle cx="32" cy="24" r="5" fill="#FFCC80" />
      <ellipse cx="32" cy="44" rx="7" ry="10" fill="#81C784" />
    </svg>
  ),
  coffee: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="10" y="22" width="28" height="30" rx="5" fill="#6D4C41" />
      <ellipse cx="24" cy="22" rx="14" ry="5" fill="#4E342E" />
      <rect x="8" y="18" width="32" height="6" rx="3" fill="#8D6E63" />
      <path d="M38 30h5c3 0 5.5 2.5 5.5 5.5S46 41 43 41h-5" fill="none" stroke="#8D6E63" strokeWidth="4" strokeLinecap="round" />
      <path d="M20 12c0-3 1.5-5 1.5-7" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M25 10c0-3 1.5-5 1.5-7" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M30 12c0-3 1.5-5 1.5-7" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  sushi: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="4" y="46" width="56" height="8" rx="4" fill="#C4956A" />
      <rect x="10" y="30" width="20" height="16" rx="8" fill="#2C3E50" />
      <ellipse cx="20" cy="30" rx="10" ry="8" fill="#34495E" />
      <ellipse cx="20" cy="30" rx="8" ry="6" fill="white" />
      <ellipse cx="20" cy="29" rx="5.5" ry="4" fill="#FF8A65" />
      <ellipse cx="20" cy="28" rx="4" ry="2.5" fill="#EF5350" />
      <rect x="36" y="32" width="16" height="14" rx="7" fill="#2C3E50" />
      <ellipse cx="44" cy="32" rx="8" ry="6" fill="#34495E" />
      <ellipse cx="44" cy="32" rx="6" ry="4.5" fill="white" />
      <ellipse cx="44" cy="31" rx="4.5" ry="3" fill="#FF8A65" />
      <ellipse cx="44" cy="30" rx="3" ry="2" fill="#EF5350" />
    </svg>
  ),
  burger: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M10 32c0-10 9.8-18 22-18s22 8 22 18H10z" fill="#E8B960" />
      <ellipse cx="20" cy="22" rx="1.5" ry="1" fill="#F5E6C8" opacity="0.7" />
      <ellipse cx="32" cy="18" rx="1" ry="0.8" fill="#F5E6C8" opacity="0.5" />
      <ellipse cx="40" cy="22" rx="1.2" ry="0.8" fill="#F5E6C8" opacity="0.6" />
      <path d="M10 32h44c-1 1-3 3-7 3c-3 0-3-2-6-2s-3 2-6 2-3-2-6-2-3 2-5 2c-4 0-7-3-7-3" fill="#66BB6A" />
      <rect x="10" y="35" width="44" height="5" rx="1" fill="#FFCC02" />
      <rect x="10" y="40" width="44" height="6" rx="1" fill="#795548" />
      <ellipse cx="32" cy="50" rx="22" ry="5" fill="#D4A040" />
      <ellipse cx="32" cy="48" rx="22" ry="5" fill="#E8B960" />
    </svg>
  ),
  pizza: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 6L8 52c0 2.5 10.7 4.5 24 4.5S56 54.5 56 52L32 6z" fill="#E8B960" />
      <path d="M32 10L12 48c0 0 8.7 3 20 3s20-3 20-3L32 10z" fill="#FFCC02" />
      <path d="M12 48c0 0 8.7 4 20 4s20-4 20-4" fill="#D4A040" />
      <circle cx="26" cy="28" r="4" fill="#E53935" />
      <circle cx="36" cy="24" r="3.5" fill="#E53935" />
      <circle cx="28" cy="40" r="3.5" fill="#E53935" />
      <circle cx="38" cy="36" r="3" fill="#E53935" />
      <ellipse cx="20" cy="36" rx="2.5" ry="2" fill="#388E3C" />
      <ellipse cx="34" cy="32" rx="2" ry="1.5" fill="#388E3C" />
    </svg>
  ),
  dumpling: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="48" rx="20" ry="8" fill="#B8895E" />
      <rect x="12" y="32" width="40" height="16" rx="2" fill="#C4956A" />
      <ellipse cx="32" cy="32" rx="20" ry="8" fill="#D4A574" />
      <path d="M14 36h36" stroke="#A07850" strokeWidth="1.5" opacity="0.3" />
      <path d="M14 40h36" stroke="#A07850" strokeWidth="1.5" opacity="0.3" />
      <path d="M14 44h36" stroke="#A07850" strokeWidth="1.5" opacity="0.3" />
      <ellipse cx="24" cy="30" rx="8" ry="6" fill="#FFE0B2" />
      <path d="M16 30c2-1.5 4 0.5 6-1s4 1 6-0.5" stroke="#FFB74D" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
      <ellipse cx="38" cy="28" rx="7" ry="5.5" fill="#FFE0B2" />
      <path d="M31 28c2-1 3 0.5 5-0.5s3 1 5-0.5" stroke="#FFB74D" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
    </svg>
  ),
  egg: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="40" rx="22" ry="14" fill="#333333" />
      <ellipse cx="32" cy="38" rx="22" ry="14" fill="#424242" />
      <rect x="2" y="36" width="8" height="3" rx="1.5" fill="#546E7A" />
      <ellipse cx="32" cy="36" rx="14" ry="9" fill="white" />
      <ellipse cx="32" cy="35" rx="13" ry="8" fill="#FAFAFA" />
      <circle cx="32" cy="34" r="7" fill="#FFD54F" />
      <circle cx="32" cy="32" r="5" fill="#FFE082" />
    </svg>
  ),
  boba: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M18 18h28l-3 34c0 2.5-5 4.5-11 4.5S19 54.5 19 52l-3-34z" fill="#E1BEE7" opacity="0.8" />
      <path d="M20 24h24l-2.5 26c0 2-4 4-9.5 4s-9.5-2-9.5-4L20 24z" fill="#CE93D8" />
      <rect x="16" y="14" width="32" height="7" rx="3.5" fill="#9C27B0" />
      <path d="M32 6v10" stroke="#6D4C41" strokeWidth="3" strokeLinecap="round" />
      <circle cx="26" cy="46" r="3" fill="#3E2723" />
      <circle cx="34" cy="48" r="2.5" fill="#3E2723" />
      <circle cx="28" cy="50" r="2.5" fill="#4E342E" />
      <circle cx="36" cy="44" r="3" fill="#3E2723" />
      <circle cx="30" cy="42" r="2" fill="#4E342E" />
    </svg>
  ),
  croissant: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M10 38c0-10 8-22 22-22s22 12 22 22c0 5-8 10-22 10S10 43 10 38z" fill="#D4A040" />
      <path d="M14 36c6-8 10-14 18-14s12 6 18 14" fill="#E8B960" opacity="0.6" />
      <path d="M16 40c3-1.5 6 1 9-0.5s6 1.5 9-0.5 6 1.5 8 1" stroke="#B8863A" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
      <path d="M18 44c3-1 5 0.5 8-0.5s5 1 8-0.5 5 1 6 0.5" stroke="#C49040" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
    </svg>
  ),
  plate: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="42" rx="24" ry="12" fill="#E0E0E0" />
      <ellipse cx="32" cy="40" rx="24" ry="12" fill="#F5F5F5" />
      <ellipse cx="32" cy="40" rx="16" ry="8" fill="#FAFAFA" />
      <ellipse cx="32" cy="40" rx="12" ry="5" fill="white" />
      <path d="M20 22l-3-14" stroke="#BDBDBD" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 8c0-1 2-2 4-1s2 2 2 3" stroke="#BDBDBD" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M44 22v-16" stroke="#BDBDBD" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 6h4" stroke="#BDBDBD" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 10h4" stroke="#BDBDBD" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  grid: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="6" y="6" width="22" height="22" rx="6" fill="#90CAF9" />
      <rect x="36" y="6" width="22" height="22" rx="6" fill="#A5D6A7" />
      <rect x="6" y="36" width="22" height="22" rx="6" fill="#FFCC80" />
      <rect x="36" y="36" width="22" height="22" rx="6" fill="#EF9A9A" />
    </svg>
  ),
  sparkle: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 4l4 18h18l-14 10 5 18-13-10-13 10 5-18L10 22h18l4-18z" fill="#FFCC02" />
      <path d="M32 14l2 9h9l-7 5 2.5 9-6.5-5-6.5 5 2.5-9-7-5h9l2-9z" fill="#FFE082" opacity="0.6" />
    </svg>
  ),
  "flag-th": (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="6" width="3" height="50" rx="1.5" fill="#9E9E9E" />
      <circle cx="9.5" cy="6" r="2.5" fill="#FFD700" />
      <rect x="11" y="10" width="42" height="32" rx="3" fill="#ED1C24" />
      <rect x="11" y="15.3" width="42" height="5.3" fill="white" />
      <rect x="11" y="20.6" width="42" height="10.8" fill="#241D4F" />
      <rect x="11" y="31.4" width="42" height="5.3" fill="white" />
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

export const FoodIcon = memo(function FoodIcon({ name, size = 32, className = "" }: FoodIconProps) {
  const uid = useId().replace(/:/g, "");
  const renderIcon = icons[name];
  if (!renderIcon) return null;
  return (
    <span
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
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
