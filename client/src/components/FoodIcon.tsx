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
      <path d="M32 4c-4 10-18 22-18 36c0 5 2.5 9 6 12l6 4l6-4l6 4l6-4c3.5-3 6-7 6-12C50 26 36 14 32 4z" fill="#E8752C" />
      <path d="M32 4c-4 10-18 22-18 36c0 5 2.5 9 6 12l6-4l6 4l6-4c3.5-3 6-7 6-12C50 26 36 14 32 4z" fill="#FF9A5C" />
      <path d="M32 22c-2 6-10 14-10 22c0 3 1.5 5.5 4 7l6-3l6 3c2.5-1.5 4-4 4-7c0-8-8-16-10-22z" fill="#FFD166" />
      <path d="M32 22c-2 6-10 14-10 22c0 3 1.5 5.5 4 7l6 3l6-3c2.5-1.5 4-4 4-7c0-8-8-16-10-22z" fill="#FFE49A" />
      <ellipse cx="32" cy="48" rx="5" ry="6" fill="#FFF3D4" />
      <ellipse cx="30" cy="46" rx="2" ry="3" fill="white" opacity="0.3" />
    </svg>
  ),
  chili: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M30 10c-1-3 1-5 4-4c2 1 4 4 2 6" fill="#4CAF50" />
      <path d="M34 6c0-2 2-3 4-2c2 1 3 3 1 5" fill="#66BB6A" />
      <path d="M24 54c-1-4-2-10-1-18c1-10 5-20 12-26c3-3 6-1 5 3c-2 8-4 16-5 22c-1 8-2 14-4 18c-1 3-4 4-7 1z" fill="#C62828" />
      <path d="M24 54c-1-4-2-10-1-18c1-10 5-20 12-26c3-3 6-1 5 3c-2 8-4 16-5 22c-1 8-2 14-4 18c-1 3-4 4-7 1z" fill="#EF5350" />
      <path d="M28 54c-1-4-1-10 0-18c1-10 4-20 10-26" fill="#EF5350" />
      <ellipse cx="30" cy="32" rx="3" ry="8" fill="#FF8A80" opacity="0.4" />
      <ellipse cx="28" cy="24" rx="1.5" ry="3" fill="#FFCDD2" opacity="0.3" />
    </svg>
  ),
  cocktail: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="58" rx="10" ry="3.5" fill="#9E9E9E" />
      <path d="M22 58l10-3.5l10 3.5" fill="#BDBDBD" />
      <rect x="30" y="38" width="4" height="20" fill="#B0BEC5" />
      <rect x="29" y="38" width="4" height="20" fill="#CFD8DC" />
      <path d="M12 12l6 2l14 24h-4L12 12z" fill="#B0BEC5" />
      <path d="M52 12l-6 2l-14 24h4L52 12z" fill="#E0E0E0" />
      <path d="M12 12h40L36 38h-8L12 12z" fill="#E8EDF2" />
      <path d="M18 18h28l-10 18h-8z" fill="#F8BBD0" opacity="0.7" />
      <path d="M18 18h28l-10 18h-8z" fill="#F48FB1" />
      <circle cx="44" cy="10" r="6" fill="#E65100" />
      <circle cx="43" cy="9" r="6" fill="#FF8A65" />
      <ellipse cx="44" cy="4" rx="4" ry="3" fill="#388E3C" />
      <ellipse cx="43" cy="3" rx="4" ry="3" fill="#66BB6A" />
    </svg>
  ),
  money: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="24" cy="42" rx="14" ry="14" fill="#C6930F" />
      <ellipse cx="24" cy="39" rx="14" ry="14" fill="#E8B830" />
      <ellipse cx="24" cy="37" rx="14" ry="14" fill="#FFD54F" />
      <ellipse cx="24" cy="37" rx="10" ry="10" fill="#FFECB3" opacity="0.35" />
      <ellipse cx="24" cy="37" rx="5" ry="5" fill="#FFF8E1" opacity="0.3" />
      <ellipse cx="40" cy="34" rx="14" ry="14" fill="#C6930F" />
      <ellipse cx="40" cy="31" rx="14" ry="14" fill="#F0C040" />
      <ellipse cx="40" cy="29" rx="14" ry="14" fill="#FFE082" />
      <ellipse cx="40" cy="29" rx="10" ry="10" fill="#FFF8E1" opacity="0.35" />
      <ellipse cx="40" cy="29" rx="5" ry="5" fill="white" opacity="0.25" />
    </svg>
  ),
  salad: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="50" rx="24" ry="10" fill="#C4B09A" />
      <path d="M8 40v10c0 0 10 10 24 10s24-10 24-10V40H8z" fill="#D4C0AA" />
      <ellipse cx="32" cy="40" rx="24" ry="10" fill="#E8DDD0" />
      <ellipse cx="32" cy="38" rx="24" ry="10" fill="#F2EBE2" />
      <ellipse cx="24" cy="32" rx="9" ry="7" fill="#388E3C" />
      <ellipse cx="24" cy="31" rx="9" ry="7" fill="#66BB6A" />
      <ellipse cx="38" cy="30" rx="8" ry="6" fill="#2E7D32" />
      <ellipse cx="38" cy="29" rx="8" ry="6" fill="#81C784" />
      <ellipse cx="31" cy="28" rx="6" ry="4.5" fill="#7CB342" />
      <ellipse cx="31" cy="27" rx="6" ry="4.5" fill="#AED581" />
      <circle cx="22" cy="27" r="3.5" fill="#C62828" />
      <circle cx="22" cy="26" r="3.5" fill="#EF5350" />
      <circle cx="36" cy="25" r="2.5" fill="#E65100" />
      <circle cx="36" cy="24" r="2.5" fill="#FFA726" />
    </svg>
  ),
  umbrella: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M8 34c0-15 10.7-26 24-26s24 11 24 26H8z" fill="#D4725A" />
      <path d="M8 34c0-15 10.7-26 24-26s24 11 24 26H8z" fill="#FF9A76" />
      <path d="M56 34c0-15-10.7-26-24-26" fill="#FFB89E" opacity="0.4" />
      <path d="M32 34v-26" fill="none" />
      <ellipse cx="32" cy="34" rx="24" ry="3" fill="#D4725A" opacity="0.3" />
      <rect x="30" y="34" width="4" height="22" rx="2" fill="#6D4C41" />
      <rect x="29" y="34" width="4" height="22" rx="2" fill="#8D6E63" />
      <path d="M29 56c0-2 2-4 4.5-4s4.5 2 4.5 4" fill="#5D4037" />
      <path d="M28 56c0-2 2-4 4.5-4s4.5 2 4.5 4" fill="#6D4C41" />
    </svg>
  ),
  hearts: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 58l-4-3C10 40 2 30 2 20C2 11 8.5 4 17 4c5 0 9.5 2.3 12.5 6h5C37.5 6.3 42 4 47 4c8.5 0 15 7 15 16 0 10-8 20-26 35z" fill="#C2185B" />
      <path d="M32 56l-4-3C10 38 2 28 2 18C2 9 8.5 2 17 2c5 0 9.5 2.3 12.5 6h5C37.5 4.3 42 2 47 2c8.5 0 15 7 15 16 0 10-8 20-26 35z" fill="#E91E63" />
      <path d="M32 54l-3-3C12 36 4 27 4 18c0-8 6-14 13-14c4 0 8 2 10.5 5h5C35 6 39 4 43 4c7 0 13 6 13 14 0 9-8 18-24 33z" fill="#F48FB1" />
      <ellipse cx="18" cy="14" rx="5" ry="6" fill="#F8BBD0" opacity="0.5" />
    </svg>
  ),
  scooter: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="14" cy="52" rx="9" ry="9" fill="#546E7A" />
      <ellipse cx="14" cy="50" rx="9" ry="9" fill="#78909C" />
      <ellipse cx="14" cy="50" rx="5.5" ry="5.5" fill="#B0BEC5" />
      <ellipse cx="14" cy="49" rx="2" ry="2" fill="#CFD8DC" />
      <ellipse cx="50" cy="52" rx="9" ry="9" fill="#546E7A" />
      <ellipse cx="50" cy="50" rx="9" ry="9" fill="#78909C" />
      <ellipse cx="50" cy="50" rx="5.5" ry="5.5" fill="#B0BEC5" />
      <ellipse cx="50" cy="49" rx="2" ry="2" fill="#CFD8DC" />
      <path d="M14 44h12l4-20h14v-4h4v8H36l-3 16H14z" fill="#BF360C" />
      <path d="M14 42h12l4-20h14v-4h4v8H36l-3 16H14z" fill="#FF7043" />
      <path d="M14 40h12l4-20h14v4H36l-3 16H14z" fill="#FF8A65" />
      <rect x="46" y="16" width="6" height="14" rx="3" fill="#E64A19" />
      <rect x="45" y="14" width="6" height="14" rx="3" fill="#FF8A65" />
      <rect x="44" y="12" width="6" height="14" rx="3" fill="#FFAB91" />
    </svg>
  ),
  moon: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M46 10c-20 2-28 18-26 34s18 20 28 18c-4 2-10 0-20-6c-10-6-16-22-12-34c3-8 12-14 20-16z" fill="#E8A000" />
      <path d="M44 8c-18 2-26 16-24 32s16 20 26 18c-4 2-10 0-18-5c-10-6-16-22-12-34c3-7 12-13 20-15z" fill="#FFC107" />
      <path d="M42 6c-16 2-24 14-22 30s14 18 24 16c-4 2-8 0-16-4c-8-6-14-20-10-30c2-6 10-11 16-14z" fill="#FFD54F" />
      <ellipse cx="34" cy="20" rx="2.5" ry="3" fill="#FFF8E1" opacity="0.5" />
      <ellipse cx="26" cy="36" rx="2" ry="2.5" fill="#FFF8E1" opacity="0.4" />
      <circle cx="10" cy="16" r="2" fill="#FFF8E1" opacity="0.3" />
      <circle cx="8" cy="38" r="1.5" fill="#FFF8E1" opacity="0.25" />
      <circle cx="54" cy="12" r="1.5" fill="#FFF8E1" opacity="0.2" />
    </svg>
  ),
  cake: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M8 38h48v18c0 0-10 4-24 4s-24-4-24-4V38z" fill="#C2185B" />
      <path d="M8 36h48v18c0 0-10 4-24 4s-24-4-24-4V36z" fill="#E91E63" />
      <rect x="8" y="34" width="48" height="6" rx="3" fill="#F06292" />
      <path d="M12 26h40v10H12z" fill="#E8A000" />
      <path d="M12 24h40v10H12z" fill="#FFC107" />
      <rect x="12" y="22" width="40" height="6" rx="3" fill="#FFD54F" />
      <rect x="28" y="8" width="8" height="16" rx="4" fill="#FFF3E0" />
      <rect x="27" y="6" width="8" height="16" rx="4" fill="#FFF9C4" />
      <ellipse cx="31" cy="6" rx="5" ry="5" fill="#E65100" />
      <ellipse cx="30" cy="4" rx="5" ry="5" fill="#FF8A65" />
      <ellipse cx="30" cy="2" rx="2.5" ry="3.5" fill="#FFCC02" opacity="0.7" />
    </svg>
  ),
  pancakes: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="54" rx="24" ry="8" fill="#8D6E63" />
      <path d="M8 46v8c0 0 10 8 24 8s24-8 24-8V46H8z" fill="#A1887F" />
      <ellipse cx="32" cy="46" rx="24" ry="8" fill="#BCAAA4" />
      <ellipse cx="32" cy="44" rx="24" ry="8" fill="#D7CCC8" />
      <ellipse cx="32" cy="40" rx="20" ry="7" fill="#8D6E63" />
      <path d="M12 34v6c0 0 8 7 20 7s20-7 20-7V34H12z" fill="#A1887F" />
      <ellipse cx="32" cy="34" rx="20" ry="7" fill="#BCAAA4" />
      <ellipse cx="32" cy="32" rx="20" ry="7" fill="#D7CCC8" />
      <ellipse cx="32" cy="28" rx="16" ry="6" fill="#8D6E63" />
      <path d="M16 23v5c0 0 6 6 16 6s16-6 16-6V23H16z" fill="#A1887F" />
      <ellipse cx="32" cy="23" rx="16" ry="6" fill="#BCAAA4" />
      <ellipse cx="32" cy="21" rx="16" ry="6" fill="#D7CCC8" />
      <ellipse cx="32" cy="19" rx="8" ry="3.5" fill="#FFB74D" opacity="0.5" />
      <path d="M40 14l4 2v10l-4-2V14z" fill="#E8A000" />
      <rect x="38" y="10" width="6" height="14" rx="3" fill="#FFCC02" />
    </svg>
  ),
  noodles: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="52" rx="26" ry="10" fill="#C4B09A" />
      <path d="M6 38v14c0 0 10 10 26 10s26-10 26-10V38H6z" fill="#D4C0AA" />
      <ellipse cx="32" cy="38" rx="26" ry="10" fill="#E0D4C4" />
      <ellipse cx="32" cy="36" rx="26" ry="10" fill="#F0E8DE" />
      <ellipse cx="32" cy="32" rx="18" ry="8" fill="#FFF8E1" />
      <path d="M16 30c4 5 6-2 10 3s6-3 10 2c4-5 6 2 8 1" fill="#FFB74D" />
      <path d="M18 34c3 4 5-2 8 2s5-2 7 1c3-3 5 1 6 0" fill="#FF9800" opacity="0.5" />
      <circle cx="22" cy="28" r="3.5" fill="#C62828" />
      <circle cx="22" cy="27" r="3.5" fill="#EF5350" />
      <circle cx="38" cy="26" r="3" fill="#2E7D32" />
      <circle cx="38" cy="25" r="3" fill="#81C784" />
      <path d="M44 12l2 1v18l-2-1V12z" fill="#6D4C41" />
      <rect x="42" y="10" width="4" height="20" rx="2" fill="#8D6E63" />
      <path d="M50 12l2 1v18l-2-1V12z" fill="#6D4C41" />
      <rect x="48" y="10" width="4" height="20" rx="2" fill="#8D6E63" />
    </svg>
  ),
  city: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M4 28h16v30H4z" fill="#78909C" />
      <path d="M20 28l4-4v30l-4 4V28z" fill="#546E7A" />
      <rect x="4" y="24" width="16" height="34" rx="2" fill="#90A4AE" />
      <path d="M18 12h18v46H18z" fill="#546E7A" />
      <path d="M36 12l4-4v46l-4 4V12z" fill="#37474F" />
      <rect x="18" y="8" width="18" height="50" rx="2" fill="#607D8B" />
      <path d="M40 22h16v36H40z" fill="#90A4AE" />
      <path d="M56 22l4-4v36l-4 4V22z" fill="#78909C" />
      <rect x="40" y="18" width="16" height="40" rx="2" fill="#B0BEC5" />
      <rect x="7" y="30" width="4" height="4" rx="1" fill="#FFF9C4" />
      <rect x="13" y="30" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.7" />
      <rect x="7" y="38" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.5" />
      <rect x="22" y="14" width="4" height="4" rx="1" fill="#FFF9C4" />
      <rect x="29" y="14" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.7" />
      <rect x="22" y="22" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.8" />
      <rect x="29" y="22" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.5" />
      <rect x="44" y="24" width="4" height="4" rx="1" fill="#FFF9C4" />
      <rect x="50" y="24" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.6" />
      <rect x="44" y="32" width="4" height="4" rx="1" fill="#FFF9C4" opacity="0.5" />
    </svg>
  ),
  family: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="14" cy="18" rx="8" ry="9" fill="#D4944A" />
      <ellipse cx="14" cy="16" rx="8" ry="9" fill="#F5D5B5" />
      <ellipse cx="12" cy="14" rx="3" ry="3.5" fill="#FFE8CC" opacity="0.4" />
      <path d="M4 56l10-3l10 3V30c0-4-4-8-10-8S4 26 4 30v26z" fill="#1565C0" />
      <path d="M4 56V30c0-4 4-8 10-8s10 4 10 8v26l-10-3z" fill="#42A5F5" />

      <ellipse cx="50" cy="18" rx="8" ry="9" fill="#D4944A" />
      <ellipse cx="50" cy="16" rx="8" ry="9" fill="#F5D5B5" />
      <ellipse cx="48" cy="14" rx="3" ry="3.5" fill="#FFE8CC" opacity="0.4" />
      <path d="M40 56l10-3l10 3V30c0-4-4-8-10-8s-10 4-10 8v26z" fill="#AD1457" />
      <path d="M40 56V30c0-4 4-8 10-8s10 4 10 8v26l-10-3z" fill="#EC407A" />

      <ellipse cx="32" cy="26" rx="6" ry="7" fill="#D4944A" />
      <ellipse cx="32" cy="24" rx="6" ry="7" fill="#F5D5B5" />
      <ellipse cx="31" cy="23" rx="2.5" ry="3" fill="#FFE8CC" opacity="0.4" />
      <path d="M24 58l8-2l8 2V36c0-3-3-6-8-6s-8 3-8 6v22z" fill="#2E7D32" />
      <path d="M24 58V36c0-3 3-6 8-6s8 3 8 6v22l-8-2z" fill="#66BB6A" />
    </svg>
  ),
  coffee: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M6 24h36v30c0 3-8 6-18 6S6 57 6 54V24z" fill="#5D4037" />
      <path d="M6 22h36v30c0 3-8 6-18 6S6 55 6 52V22z" fill="#6D4C41" />
      <path d="M6 20h36v6H6z" fill="#8D6E63" />
      <rect x="6" y="18" width="36" height="6" rx="3" fill="#A1887F" />
      <ellipse cx="24" cy="18" rx="18" ry="6" fill="#5D4037" />
      <ellipse cx="24" cy="17" rx="14" ry="4.5" fill="#4E342E" />
      <ellipse cx="22" cy="16" rx="4" ry="2" fill="#3E2723" opacity="0.3" />
      <path d="M42 28c5 0 10 3 10 8s-5 8-10 8" fill="#6D4C41" />
      <path d="M42 26c5 0 10 3 10 8s-5 8-10 8" fill="#8D6E63" />
      <ellipse cx="16" cy="10" rx="2" ry="5" fill="#D7CCC8" opacity="0.35" />
      <ellipse cx="24" cy="8" rx="2" ry="5" fill="#D7CCC8" opacity="0.3" />
      <ellipse cx="32" cy="10" rx="2" ry="5" fill="#D7CCC8" opacity="0.35" />
    </svg>
  ),
  sushi: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M2 50h60v6c0 2-13 4-30 4S2 58 2 56v-6z" fill="#8D6E63" />
      <rect x="2" y="46" width="60" height="6" rx="2" fill="#A1887F" />
      <rect x="2" y="44" width="60" height="4" rx="2" fill="#BCAAA4" />

      <ellipse cx="20" cy="42" rx="13" ry="8" fill="#263238" />
      <path d="M7 34v8c0 0 5 8 13 8s13-8 13-8V34H7z" fill="#37474F" />
      <ellipse cx="20" cy="34" rx="13" ry="8" fill="#455A64" />
      <ellipse cx="20" cy="33" rx="10" ry="6" fill="white" />
      <ellipse cx="20" cy="32" rx="8" ry="5" fill="#FFCCBC" />
      <ellipse cx="20" cy="31" rx="5.5" ry="3.5" fill="#EF5350" />

      <ellipse cx="46" cy="40" rx="11" ry="7" fill="#263238" />
      <path d="M35 34v6c0 0 4 7 11 7s11-7 11-7V34H35z" fill="#37474F" />
      <ellipse cx="46" cy="34" rx="11" ry="7" fill="#455A64" />
      <ellipse cx="46" cy="33" rx="8" ry="5" fill="white" />
      <ellipse cx="46" cy="32" rx="6" ry="4" fill="#FFCCBC" />
      <ellipse cx="46" cy="31" rx="4" ry="2.5" fill="#EF5350" />
    </svg>
  ),
  burger: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M6 32c0-13 11.6-22 26-22s26 9 26 22H6z" fill="#D4A040" />
      <path d="M6 30c0-13 11.6-22 26-22s26 9 26 22H6z" fill="#E8B960" />
      <path d="M6 28c0-12 11.6-20 26-20s26 8 26 20H6z" fill="#F0CC70" />
      <ellipse cx="20" cy="18" rx="2" ry="1.2" fill="#FFF3D4" opacity="0.5" />
      <ellipse cx="32" cy="14" rx="1.8" ry="1" fill="#FFF3D4" opacity="0.4" />
      <ellipse cx="44" cy="18" rx="1.5" ry="1" fill="#FFF3D4" opacity="0.4" />
      <rect x="4" y="30" width="56" height="5" rx="2" fill="#388E3C" />
      <rect x="4" y="28" width="56" height="5" rx="2" fill="#66BB6A" />
      <rect x="4" y="33" width="56" height="4" rx="1" fill="#E8A000" />
      <rect x="4" y="31" width="56" height="4" rx="1" fill="#FFCC02" />
      <rect x="4" y="35" width="56" height="6" rx="1" fill="#5D4037" />
      <rect x="4" y="33" width="56" height="6" rx="1" fill="#795548" />
      <path d="M6 46c0 0 11 8 26 8s26-8 26-8" fill="#C6930F" />
      <ellipse cx="32" cy="50" rx="26" ry="6" fill="#D4A040" />
      <ellipse cx="32" cy="48" rx="26" ry="6" fill="#E8B960" />
    </svg>
  ),
  pizza: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M34 6L8 56c0 3 11 5 24 5s24-2 24-5L34 6z" fill="#C49030" />
      <path d="M32 4L6 54c0 3 11 5 26 5s26-2 26-5L32 4z" fill="#E8B960" />
      <path d="M32 10L10 50c0 0 9 4 22 4s22-4 22-4L32 10z" fill="#FFD54F" />
      <path d="M10 50c0 0 9 5 22 5s22-5 22-5" fill="#C49030" />
      <path d="M8 52c0 0 10 6 24 6s24-6 24-6" fill="#D4A040" opacity="0.5" />
      <circle cx="26" cy="28" r="4.5" fill="#C62828" />
      <circle cx="26" cy="27" r="4.5" fill="#EF5350" />
      <circle cx="38" cy="24" r="4" fill="#C62828" />
      <circle cx="38" cy="23" r="4" fill="#EF5350" />
      <circle cx="28" cy="42" r="4" fill="#C62828" />
      <circle cx="28" cy="41" r="4" fill="#EF5350" />
      <circle cx="40" cy="38" r="3.5" fill="#C62828" />
      <circle cx="40" cy="37" r="3.5" fill="#EF5350" />
      <ellipse cx="20" cy="38" rx="3" ry="2.5" fill="#2E7D32" />
      <ellipse cx="20" cy="37" rx="3" ry="2.5" fill="#66BB6A" />
    </svg>
  ),
  dumpling: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="54" rx="24" ry="8" fill="#8D6E63" />
      <path d="M8 38v16c0 0 10 8 24 8s24-8 24-8V38H8z" fill="#A1887F" />
      <ellipse cx="32" cy="38" rx="24" ry="8" fill="#BCAAA4" />
      <ellipse cx="32" cy="36" rx="24" ry="8" fill="#D7CCC8" />
      <ellipse cx="22" cy="32" rx="10" ry="8" fill="#E8DDD0" />
      <ellipse cx="22" cy="30" rx="10" ry="8" fill="#FFF3E0" />
      <ellipse cx="22" cy="28" rx="5" ry="3" fill="#FFE0B2" opacity="0.4" />
      <path d="M22 22c-3 0-6 2-8 4s-3 4-3 6c1-2 3-5 6-7s5-3 7-3z" fill="#FFECB3" opacity="0.3" />
      <ellipse cx="42" cy="30" rx="9" ry="7" fill="#E8DDD0" />
      <ellipse cx="42" cy="28" rx="9" ry="7" fill="#FFF3E0" />
      <ellipse cx="42" cy="26" rx="5" ry="3" fill="#FFE0B2" opacity="0.4" />
    </svg>
  ),
  egg: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="46" rx="26" ry="14" fill="#37474F" />
      <path d="M6 36v10c0 0 10 14 26 14s26-14 26-14V36H6z" fill="#455A64" />
      <ellipse cx="32" cy="36" rx="26" ry="14" fill="#546E7A" />
      <ellipse cx="32" cy="34" rx="26" ry="14" fill="#607D8B" />
      <rect x="2" y="32" width="8" height="6" rx="3" fill="#546E7A" />
      <rect x="1" y="30" width="8" height="6" rx="3" fill="#607D8B" />
      <ellipse cx="32" cy="32" rx="18" ry="10" fill="#E0E0E0" />
      <ellipse cx="32" cy="30" rx="18" ry="10" fill="white" />
      <circle cx="32" cy="30" r="8" fill="#E8A000" />
      <circle cx="32" cy="28" r="8" fill="#FFD54F" />
      <circle cx="32" cy="27" r="6" fill="#FFE082" />
      <ellipse cx="29" cy="25" rx="2.5" ry="3" fill="#FFF8E1" opacity="0.4" />
    </svg>
  ),
  boba: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M18 20h30l-4 38c-0.5 3-5 5-12 5s-11.5-2-12-5L18 20z" fill="#7B1FA2" opacity="0.3" />
      <path d="M16 18h32l-4 38c-0.5 3-6 5-12 5s-11.5-2-12-5L16 18z" fill="#CE93D8" opacity="0.5" />
      <path d="M16 18h32l-4 38c-0.5 3-6 5-12 5s-11.5-2-12-5L16 18z" fill="#E1BEE7" opacity="0.6" />
      <path d="M20 26h24l-3 28c-0.3 2-4 4-9 4s-8.7-2-9-4L20 26z" fill="#AB47BC" />
      <path d="M19 24h24l-3 28c-0.3 2-4 4-9 4s-8.7-2-9-4L19 24z" fill="#CE93D8" />
      <rect x="14" y="16" width="36" height="6" rx="3" fill="#7B1FA2" />
      <rect x="13" y="14" width="36" height="6" rx="3" fill="#9C27B0" />
      <rect x="12" y="12" width="36" height="6" rx="3" fill="#AB47BC" />
      <path d="M32 2l2 1v12l-2-1V2z" fill="#5D4037" />
      <rect x="29" y="0" width="5" height="14" rx="2.5" fill="#8D6E63" />
      <circle cx="26" cy="44" r="3.5" fill="#3E2723" />
      <circle cx="26" cy="43" r="3.5" fill="#4E342E" />
      <circle cx="34" cy="46" r="3" fill="#3E2723" />
      <circle cx="34" cy="45" r="3" fill="#4E342E" />
      <circle cx="28" cy="50" r="3" fill="#3E2723" />
      <circle cx="28" cy="49" r="3" fill="#5D4037" />
      <circle cx="36" cy="40" r="3.5" fill="#3E2723" />
      <circle cx="36" cy="39" r="3.5" fill="#4E342E" />
    </svg>
  ),
  croissant: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M10 44c0-14 9-26 22-26s22 12 22 26c0 6-9 12-22 12S10 50 10 44z" fill="#A07020" />
      <path d="M8 42c0-14 10-26 24-26s24 12 24 26c0 6-10 12-24 12S8 48 8 42z" fill="#C49030" />
      <path d="M8 40c0-13 10-24 24-24s24 11 24 24c0 6-10 12-24 12S8 46 8 40z" fill="#D4A040" />
      <path d="M12 38c7-10 12-18 20-18s13 8 20 18" fill="#E8B960" opacity="0.5" />
      <ellipse cx="32" cy="42" rx="18" ry="5" fill="#A07020" opacity="0.2" />
      <path d="M16 30c4-6 8-10 16-10" fill="#E8C860" opacity="0.3" />
      <ellipse cx="22" cy="34" rx="3" ry="5" fill="#E8C860" opacity="0.25" />
    </svg>
  ),
  plate: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="50" rx="28" ry="10" fill="#BDBDBD" />
      <path d="M4 40v10c0 0 11 10 28 10s28-10 28-10V40H4z" fill="#CFD8DC" />
      <ellipse cx="32" cy="40" rx="28" ry="10" fill="#E0E0E0" />
      <ellipse cx="32" cy="38" rx="28" ry="10" fill="#EEEEEE" />
      <ellipse cx="32" cy="37" rx="20" ry="7" fill="#F5F5F5" />
      <ellipse cx="32" cy="36" rx="13" ry="5" fill="#FAFAFA" />
      <rect x="17" y="6" width="5" height="24" rx="2.5" fill="#B0BEC5" />
      <rect x="16" y="4" width="5" height="24" rx="2.5" fill="#CFD8DC" />
      <ellipse cx="18.5" cy="4" rx="4.5" ry="3.5" fill="#B0BEC5" />
      <ellipse cx="18" cy="3" rx="4.5" ry="3.5" fill="#CFD8DC" />
      <rect x="43" y="6" width="5" height="24" rx="2.5" fill="#B0BEC5" />
      <rect x="42" y="4" width="5" height="24" rx="2.5" fill="#CFD8DC" />
      <rect x="42" y="6" width="4" height="4" rx="2" fill="#B0BEC5" />
      <rect x="41" y="4" width="4" height="4" rx="2" fill="#CFD8DC" />
      <rect x="42" y="12" width="4" height="4" rx="2" fill="#B0BEC5" />
      <rect x="41" y="10" width="4" height="4" rx="2" fill="#CFD8DC" />
    </svg>
  ),
  grid: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M5 10h22v16H5z" fill="#D4944A" />
      <path d="M27 10l4-3v16l-4 3V10z" fill="#A06830" />
      <rect x="5" y="7" width="22" height="16" rx="4" fill="#FFD4A8" />
      <path d="M37 10h22v16H37z" fill="#2E7D32" />
      <path d="M59 10l4-3v16l-4 3V10z" fill="#1B5E20" />
      <rect x="37" y="7" width="22" height="16" rx="4" fill="#A5D6A7" />
      <path d="M5 38h22v16H5z" fill="#1565C0" />
      <path d="M27 38l4-3v16l-4 3V38z" fill="#0D47A1" />
      <rect x="5" y="35" width="22" height="16" rx="4" fill="#90CAF9" />
      <path d="M37 38h22v16H37z" fill="#BF360C" />
      <path d="M59 38l4-3v16l-4 3V38z" fill="#8D2206" />
      <rect x="37" y="35" width="22" height="16" rx="4" fill="#FFAB91" />
    </svg>
  ),
  more: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <ellipse cx="16" cy="18" rx="8" ry="8" fill="#A06830" />
      <ellipse cx="16" cy="16" rx="8" ry="8" fill="#D4944A" />
      <ellipse cx="16" cy="15" rx="5" ry="5" fill="#E8B960" opacity="0.3" />
      <ellipse cx="48" cy="18" rx="8" ry="8" fill="#C6930F" />
      <ellipse cx="48" cy="16" rx="8" ry="8" fill="#F0D040" />
      <ellipse cx="48" cy="15" rx="5" ry="5" fill="#FFF3D4" opacity="0.3" />
      <ellipse cx="16" cy="50" rx="8" ry="8" fill="#AD1457" />
      <ellipse cx="16" cy="48" rx="8" ry="8" fill="#F48FB1" />
      <ellipse cx="16" cy="47" rx="5" ry="5" fill="#F8BBD0" opacity="0.3" />
      <ellipse cx="48" cy="50" rx="8" ry="8" fill="#2E7D32" />
      <ellipse cx="48" cy="48" rx="8" ry="8" fill="#81C784" />
      <ellipse cx="48" cy="47" rx="5" ry="5" fill="#A5D6A7" opacity="0.3" />
      <ellipse cx="32" cy="35" rx="5" ry="5" fill="#BF360C" />
      <ellipse cx="32" cy="33" rx="5" ry="5" fill="#FFAB91" />
    </svg>
  ),
  sparkle: (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <path d="M32 4l6 20h20l-16 12 6 20-16-12-16 12 6-20L6 24h20z" fill="#E8A000" />
      <path d="M32 2l5 20h20l-16 12 6 20-15-12-15 12 6-20L7 22h20z" fill="#FFC107" />
      <path d="M32 2l5 20h20l-16 12 6 20-15-12-15 12 6-20L7 22h20z" fill="#FFD54F" />
      <path d="M32 14l3 10h10l-8 6 3 10-8-6-8 6 3-10-8-6h10z" fill="#FFF8E1" opacity="0.4" />
    </svg>
  ),
  "flag-th": (s) => (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="9" y="8" width="3.5" height="52" rx="1.75" fill="#757575" />
      <rect x="8" y="6" width="3.5" height="52" rx="1.75" fill="#9E9E9E" />
      <circle cx="9.75" cy="8" r="3" fill="#E8A000" />
      <circle cx="9.25" cy="6" r="3" fill="#FFD700" />
      <path d="M14 14h44v30l-44 4V14z" fill="#B71C1C" />
      <rect x="12" y="10" width="44" height="34" rx="3" fill="#ED1C24" />
      <rect x="12" y="15.7" width="44" height="5.7" fill="white" />
      <rect x="12" y="21.4" width="44" height="11.2" fill="#1A1340" />
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
