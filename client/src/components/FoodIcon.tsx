import { memo, useId } from "react";

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

const icons: Record<IconName, (s: number, u: string) => JSX.Element> = {
  fire: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 6c-3 8-16 20-16 34c0 11 7 18 16 18s16-7 16-18C48 26 35 14 32 6z" fill="#FF9A5C" />
      <path d="M32 26c-1.5 5-9 12-9 20c0 6 4 10 9 10s9-4 9-10c0-8-7.5-15-9-20z" fill="#FFD166" />
      <ellipse cx="32" cy="48" rx="4" ry="5" fill="#FFF3D4" />
    </svg>
  ),
  chili: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="33" cy="8" rx="4" ry="3" fill="#7CB342" />
      <ellipse cx="37" cy="6" rx="3" ry="2" fill="#9CCC65" />
      <path d="M22 50c2-24 7-34 14-38c4-2 6 2 4 7c-3 8-5 16-6 31c0 4-3 7-6 7s-6-3-6-7z" fill="#EF5350" />
      <ellipse cx="28" cy="30" rx="3" ry="7" fill="#F48C8A" opacity="0.5" />
    </svg>
  ),
  cocktail: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="57" rx="9" ry="3" fill="#CFD8DC" />
      <rect x="30" y="38" width="4" height="19" rx="2" fill="#CFD8DC" />
      <path d="M14 14h36L34 38h-4L14 14z" fill="#E3E9ED" />
      <path d="M19 20h26l-9 16h-8z" fill="#F8BBD0" />
      <circle cx="42" cy="12" r="5" fill="#FF8A65" />
      <ellipse cx="43" cy="6" rx="4" ry="2.5" fill="#81C784" />
    </svg>
  ),
  money: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="26" cy="38" r="14" fill="#E8B830" />
      <circle cx="26" cy="36" r="14" fill="#FFD54F" />
      <circle cx="26" cy="36" r="10" fill="#FFECB3" opacity="0.4" />
      <circle cx="38" cy="30" r="14" fill="#F0C040" />
      <circle cx="38" cy="28" r="14" fill="#FFE082" />
      <circle cx="38" cy="28" r="10" fill="#FFF8E1" opacity="0.4" />
    </svg>
  ),
  salad: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="46" rx="22" ry="12" fill="#E8DDD0" />
      <ellipse cx="32" cy="44" rx="22" ry="12" fill="#F2EBE2" />
      <ellipse cx="26" cy="36" rx="8" ry="6" fill="#81C784" />
      <ellipse cx="38" cy="34" rx="7" ry="5.5" fill="#66BB6A" />
      <ellipse cx="32" cy="32" rx="6" ry="4" fill="#AED581" />
      <circle cx="24" cy="30" r="3.5" fill="#EF5350" />
      <circle cx="36" cy="31" r="2.5" fill="#FFA726" />
      <circle cx="40" cy="29" r="2" fill="#FFCC02" />
    </svg>
  ),
  umbrella: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M8 32c0-14 10.7-24 24-24s24 10 24 24H8z" fill="#FF9A76" />
      <path d="M20 32c0-8 5.4-16 12-16" fill="#FFD4BC" opacity="0.5" />
      <path d="M32 32c0-8 5.4-16 12-16" fill="#FFD4BC" opacity="0.5" />
      <rect x="30.5" y="32" width="3" height="22" rx="1.5" fill="#A1887F" />
      <path d="M28 54c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" fill="#8D6E63" />
    </svg>
  ),
  hearts: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 56l-3-3C12 38 4 29 4 20c0-8 6.3-14 14-14c4.5 0 8.8 2.1 11.5 5.5h5C37.2 8.1 41.5 6 46 6c7.7 0 14 6 14 14 0 9-8 18-25 33z" fill="#F48FB1" />
      <ellipse cx="18" cy="18" rx="5" ry="6" fill="#F8BBD0" opacity="0.5" />
      <path d="M46 50l-1.5-1.5C34 40 30 36 30 32c0-4 3-7 7-7c2 0 4.3 1.2 5.5 3C43.7 26.2 46 25 48 25c4 0 7 3 7 7 0 4-4.5 8.5-9 18z" fill="#F8BBD0" />
    </svg>
  ),
  scooter: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="15" cy="50" r="8" fill="#78909C" />
      <circle cx="15" cy="50" r="5" fill="#B0BEC5" />
      <circle cx="50" cy="50" r="8" fill="#78909C" />
      <circle cx="50" cy="50" r="5" fill="#B0BEC5" />
      <rect x="36" y="24" width="14" height="12" rx="6" fill="#FF8A65" />
      <rect x="24" y="36" width="12" height="10" rx="5" fill="#E64A19" />
      <path d="M16 42h14c2 0 3-1 3-3l6-14h10" fill="#FF7043" />
      <rect x="38" y="18" width="5" height="12" rx="2.5" fill="#FFAB91" />
    </svg>
  ),
  moon: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M44 8c-18 2-26 16-24 32s16 22 28 20c-4 2-10 0-18-5c-9-6-14-20-10-32c3-7 10-13 18-15z" fill="#FFD54F" />
      <circle cx="36" cy="22" r="2.5" fill="#FFF3D4" opacity="0.6" />
      <circle cx="28" cy="40" r="2" fill="#FFF3D4" opacity="0.5" />
      <circle cx="12" cy="18" r="2" fill="#FFF8E1" opacity="0.5" />
      <circle cx="10" cy="40" r="1.5" fill="#FFF8E1" opacity="0.4" />
      <circle cx="52" cy="14" r="1.5" fill="#FFF8E1" opacity="0.3" />
    </svg>
  ),
  cake: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="10" y="36" width="44" height="20" rx="6" fill="#F06292" />
      <rect x="10" y="36" width="44" height="8" rx="4" fill="#F48FB1" opacity="0.5" />
      <rect x="14" y="24" width="36" height="14" rx="5" fill="#FFD54F" />
      <rect x="14" y="24" width="36" height="5" rx="3" fill="#FFE082" opacity="0.5" />
      <rect x="28" y="10" width="6" height="16" rx="3" fill="#FFF9C4" />
      <ellipse cx="31" cy="8" rx="4.5" ry="4.5" fill="#FF8A65" />
      <ellipse cx="31" cy="5" rx="2" ry="3" fill="#FFCC02" opacity="0.7" />
    </svg>
  ),
  pancakes: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="50" rx="22" ry="7" fill="#BCAAA4" />
      <ellipse cx="32" cy="48" rx="22" ry="7" fill="#D7CCC8" />
      <ellipse cx="32" cy="44" rx="18" ry="6" fill="#BCAAA4" />
      <ellipse cx="32" cy="42" rx="18" ry="6" fill="#D7CCC8" />
      <ellipse cx="32" cy="38" rx="15" ry="5.5" fill="#BCAAA4" />
      <ellipse cx="32" cy="36" rx="15" ry="5.5" fill="#D7CCC8" />
      <ellipse cx="32" cy="34" rx="8" ry="3" fill="#FFB74D" opacity="0.6" />
      <rect x="38" y="24" width="5" height="14" rx="2.5" fill="#FFCC02" />
    </svg>
  ),
  noodles: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="46" rx="24" ry="13" fill="#E8E0D8" />
      <ellipse cx="32" cy="44" rx="24" ry="13" fill="#F5F0ED" />
      <ellipse cx="32" cy="40" rx="18" ry="8" fill="#FFF8E1" />
      <path d="M16 36c4 6 6-2 10 4s6-4 10 3 6-3 8 3" fill="#FFB74D" />
      <path d="M18 40c3 5 5-2 8 3s5-3 7 2 4-1 6 2" fill="#FF9800" opacity="0.5" />
      <circle cx="22" cy="34" r="3.5" fill="#EF5350" />
      <circle cx="38" cy="32" r="3" fill="#81C784" />
      <rect x="42" y="14" width="3.5" height="18" rx="1.75" fill="#A1887F" />
      <rect x="47" y="14" width="3.5" height="18" rx="1.75" fill="#A1887F" />
    </svg>
  ),
  city: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="4" y="26" width="16" height="30" rx="3" fill="#B0BEC5" />
      <rect x="18" y="10" width="18" height="46" rx="3" fill="#78909C" />
      <rect x="40" y="20" width="16" height="36" rx="3" fill="#CFD8DC" />
      <rect x="7" y="30" width="4" height="4" rx="1.5" fill="#FFF9C4" />
      <rect x="13" y="30" width="4" height="4" rx="1.5" fill="#FFF9C4" opacity="0.7" />
      <rect x="7" y="38" width="4" height="4" rx="1.5" fill="#FFF9C4" opacity="0.5" />
      <rect x="22" y="14" width="4" height="4" rx="1.5" fill="#FFF9C4" />
      <rect x="30" y="14" width="4" height="4" rx="1.5" fill="#FFF9C4" opacity="0.7" />
      <rect x="22" y="22" width="4" height="4" rx="1.5" fill="#FFF9C4" opacity="0.8" />
      <rect x="30" y="22" width="4" height="4" rx="1.5" fill="#FFF9C4" opacity="0.5" />
      <rect x="44" y="26" width="4" height="4" rx="1.5" fill="#FFF9C4" />
      <rect x="50" y="26" width="4" height="4" rx="1.5" fill="#FFF9C4" opacity="0.6" />
    </svg>
  ),
  family: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="16" cy="18" r="8" fill="#FFD4A8" />
      <ellipse cx="16" cy="40" rx="10" ry="16" fill="#7BAAF7" />
      <circle cx="48" cy="18" r="8" fill="#FFD4A8" />
      <ellipse cx="48" cy="40" rx="10" ry="16" fill="#F48FB1" />
      <circle cx="32" cy="24" r="6" fill="#FFD4A8" />
      <ellipse cx="32" cy="44" rx="8" ry="12" fill="#A5D6A7" />
    </svg>
  ),
  coffee: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="22" width="32" height="32" rx="6" fill="#8D6E63" />
      <ellipse cx="24" cy="22" rx="16" ry="6" fill="#6D4C41" />
      <ellipse cx="24" cy="22" rx="12" ry="4" fill="#5D4037" />
      <rect x="6" y="18" width="36" height="7" rx="3.5" fill="#A1887F" />
      <rect x="6" y="18" width="36" height="3.5" rx="2" fill="#BCAAA4" opacity="0.4" />
      <path d="M40 30c4 0 8 2.5 8 6.5s-4 6.5-8 6.5" fill="#A1887F" />
      <ellipse cx="18" cy="12" rx="2" ry="4" fill="#D7CCC8" opacity="0.4" />
      <ellipse cx="24" cy="10" rx="2" ry="4" fill="#D7CCC8" opacity="0.3" />
      <ellipse cx="30" cy="12" rx="2" ry="4" fill="#D7CCC8" opacity="0.4" />
    </svg>
  ),
  sushi: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="2" y="46" width="60" height="10" rx="5" fill="#D4A574" />
      <rect x="2" y="46" width="60" height="4" rx="2" fill="#E8C89A" opacity="0.4" />
      <ellipse cx="20" cy="42" rx="12" ry="9" fill="#37474F" />
      <ellipse cx="20" cy="32" rx="12" ry="9" fill="#455A64" />
      <ellipse cx="20" cy="32" rx="9" ry="6.5" fill="white" />
      <ellipse cx="20" cy="31" rx="7" ry="5" fill="#FFAB91" />
      <ellipse cx="20" cy="30" rx="5" ry="3.5" fill="#EF5350" />
      <ellipse cx="44" cy="40" rx="10" ry="7" fill="#37474F" />
      <ellipse cx="44" cy="34" rx="10" ry="7" fill="#455A64" />
      <ellipse cx="44" cy="34" rx="7" ry="5" fill="white" />
      <ellipse cx="44" cy="33" rx="5.5" ry="3.5" fill="#FFAB91" />
      <ellipse cx="44" cy="32" rx="4" ry="2.5" fill="#EF5350" />
    </svg>
  ),
  burger: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M8 34c0-12 10.7-20 24-20s24 8 24 20H8z" fill="#E8B960" />
      <ellipse cx="20" cy="22" rx="2" ry="1.2" fill="#F5E6C8" opacity="0.6" />
      <ellipse cx="32" cy="18" rx="1.5" ry="1" fill="#F5E6C8" opacity="0.5" />
      <ellipse cx="42" cy="22" rx="1.8" ry="1" fill="#F5E6C8" opacity="0.5" />
      <rect x="6" y="34" width="52" height="5" rx="2.5" fill="#81C784" />
      <rect x="6" y="39" width="52" height="5" rx="1" fill="#FFCC02" />
      <rect x="6" y="44" width="52" height="6" rx="1" fill="#8D6E63" />
      <ellipse cx="32" cy="54" rx="24" ry="5.5" fill="#D4A040" />
      <ellipse cx="32" cy="52" rx="24" ry="5.5" fill="#E8B960" />
    </svg>
  ),
  pizza: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 4L6 54c0 3 11.6 5 26 5s26-2 26-5L32 4z" fill="#E8B960" />
      <path d="M32 10L10 50c0 0 9.8 4 22 4s22-4 22-4L32 10z" fill="#FFD54F" />
      <path d="M10 50c0 0 9.8 5 22 5s22-5 22-5" fill="#D4A040" />
      <circle cx="26" cy="28" r="4.5" fill="#EF5350" />
      <circle cx="38" cy="24" r="4" fill="#EF5350" />
      <circle cx="28" cy="42" r="4" fill="#EF5350" />
      <circle cx="40" cy="38" r="3.5" fill="#EF5350" />
      <ellipse cx="20" cy="38" rx="3" ry="2.5" fill="#66BB6A" />
      <ellipse cx="34" cy="34" rx="2.5" ry="2" fill="#66BB6A" />
    </svg>
  ),
  dumpling: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="50" rx="22" ry="9" fill="#C4956A" />
      <rect x="10" y="32" width="44" height="18" rx="3" fill="#D4A574" />
      <ellipse cx="32" cy="32" rx="22" ry="9" fill="#E0C09A" />
      <ellipse cx="24" cy="30" rx="9" ry="7" fill="#FFF3E0" />
      <ellipse cx="24" cy="28" rx="5" ry="2.5" fill="#FFE0B2" opacity="0.5" />
      <ellipse cx="40" cy="28" rx="8" ry="6" fill="#FFF3E0" />
      <ellipse cx="40" cy="26" rx="4" ry="2" fill="#FFE0B2" opacity="0.5" />
    </svg>
  ),
  egg: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="42" rx="24" ry="15" fill="#424242" />
      <ellipse cx="32" cy="40" rx="24" ry="15" fill="#546E7A" />
      <rect x="2" y="38" width="9" height="4" rx="2" fill="#607D8B" />
      <ellipse cx="32" cy="38" rx="16" ry="10" fill="white" />
      <ellipse cx="32" cy="37" rx="14" ry="9" fill="#FAFAFA" />
      <circle cx="32" cy="36" r="8" fill="#FFD54F" />
      <circle cx="32" cy="34" r="6" fill="#FFE082" />
      <ellipse cx="29" cy="32" rx="2.5" ry="3" fill="#FFF8E1" opacity="0.4" />
    </svg>
  ),
  boba: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M16 18h32l-3.5 36c-0.5 3-5.5 5-12.5 5s-12-2-12.5-5L16 18z" fill="#E1BEE7" opacity="0.7" />
      <path d="M19 26h26l-3 26c-0.3 2-4.5 4-10 4s-9.7-2-10-4L19 26z" fill="#CE93D8" />
      <rect x="14" y="14" width="36" height="8" rx="4" fill="#AB47BC" />
      <rect x="30" y="4" width="4" height="14" rx="2" fill="#8D6E63" />
      <circle cx="26" cy="46" r="3.5" fill="#4E342E" />
      <circle cx="34" cy="48" r="3" fill="#4E342E" />
      <circle cx="28" cy="52" r="3" fill="#5D4037" />
      <circle cx="36" cy="44" r="3.5" fill="#4E342E" />
      <circle cx="30" cy="42" r="2.5" fill="#5D4037" />
    </svg>
  ),
  croissant: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M8 40c0-12 9-24 24-24s24 12 24 24c0 6-9 12-24 12S8 46 8 40z" fill="#D4A040" />
      <path d="M12 38c7-9 11-16 20-16s13 7 20 16" fill="#E8B960" opacity="0.6" />
      <ellipse cx="32" cy="42" rx="18" ry="6" fill="#C49040" opacity="0.3" />
      <ellipse cx="18" cy="32" rx="4" ry="6" fill="#E8C860" opacity="0.3" />
    </svg>
  ),
  plate: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="44" rx="26" ry="13" fill="#E0E0E0" />
      <ellipse cx="32" cy="42" rx="26" ry="13" fill="#F5F5F5" />
      <ellipse cx="32" cy="42" rx="18" ry="9" fill="#FAFAFA" />
      <ellipse cx="32" cy="42" rx="12" ry="5.5" fill="white" />
      <rect x="18" y="8" width="4" height="22" rx="2" fill="#CFD8DC" />
      <ellipse cx="20" cy="8" rx="4" ry="3" fill="#CFD8DC" />
      <rect x="42" y="8" width="4" height="23" rx="2" fill="#CFD8DC" />
      <rect x="40" y="8" width="4" height="4" rx="2" fill="#CFD8DC" />
      <rect x="40" y="14" width="4" height="4" rx="2" fill="#CFD8DC" />
    </svg>
  ),
  grid: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="5" y="5" width="24" height="24" rx="7" fill="#FFD4A8" />
      <rect x="35" y="5" width="24" height="24" rx="7" fill="#A5D6A7" />
      <rect x="5" y="35" width="24" height="24" rx="7" fill="#90CAF9" />
      <rect x="35" y="35" width="24" height="24" rx="7" fill="#FFAB91" />
    </svg>
  ),
  more: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="16" cy="16" r="8" fill="#D4944A" />
      <circle cx="48" cy="16" r="8" fill="#F0D040" />
      <circle cx="16" cy="48" r="8" fill="#F48FB1" />
      <circle cx="48" cy="48" r="8" fill="#81C784" />
      <circle cx="32" cy="32" r="5" fill="#FFAB91" />
    </svg>
  ),
  sparkle: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 2l5 20h20l-16 12 6 20-15-12-15 12 6-20L7 22h20z" fill="#FFD54F" />
      <path d="M32 14l3 10h10l-8 6 3 10-8-6-8 6 3-10-8-6h10z" fill="#FFF8E1" opacity="0.5" />
    </svg>
  ),
  "flag-th": (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="8" y="6" width="3.5" height="52" rx="1.75" fill="#9E9E9E" />
      <circle cx="9.75" cy="6" r="3" fill="#FFD700" />
      <rect x="12" y="10" width="44" height="34" rx="4" fill="#ED1C24" />
      <rect x="12" y="15.7" width="44" height="5.7" fill="white" />
      <rect x="12" y="21.4" width="44" height="11.2" fill="#241D4F" />
      <rect x="12" y="32.6" width="44" height="5.7" fill="white" />
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
