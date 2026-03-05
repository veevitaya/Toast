import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Search, Flame, User, ArrowLeft } from "lucide-react";
import type { ColorTheme } from "@/components/Icon3D";

interface BottomNavProps {
  showBack?: boolean;
  showHome?: boolean;
  showProfile?: boolean;
  onBack?: () => void;
  hidden?: boolean;
}

type TabKey = "explore" | "swipe" | "profile";

const tabs: { key: TabKey; label: string; icon: typeof Search; path: string; theme: ColorTheme }[] = [
  { key: "explore", label: "Explore", icon: Search, path: "/", theme: "blue" },
  { key: "swipe", label: "Swipe", icon: Flame, path: "/swipe", theme: "orange" },
  { key: "profile", label: "Profile", icon: User, path: "/profile", theme: "purple" },
];

function getActiveTab(location: string): TabKey {
  if (location === "/") return "explore";
  if (location === "/restaurants" || location.startsWith("/restaurant/")) return "explore";
  if (location === "/swipe" || location.startsWith("/solo") || location.startsWith("/group")) return "swipe";
  if (location === "/profile" || location.startsWith("/toast-picks")) return "profile";
  return "explore";
}

export function BottomNav({ showBack = true, onBack, hidden = false }: BottomNavProps) {
  const [location, navigate] = useLocation();
  const activeTab = getActiveTab(location);

  const isHidden = hidden;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: isHidden ? 0 : 1, y: isHidden ? 80 : 0 }}
      transition={{ type: "spring", damping: 24, stiffness: 200, mass: 0.9 }}
      className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-gray-950 border-t border-gray-200/60 dark:border-gray-800/60 safe-bottom"
      style={{ pointerEvents: isHidden ? "none" : "auto" }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-0.5">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex flex-col items-center justify-center gap-0.5 px-3 py-1"
            style={{ color: "#9ca3af" }}
            data-testid="button-back"
          >
            <ArrowLeft className="w-[22px] h-[22px]" strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-tight">Back</span>
          </button>
        )}
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          const THEME_COLORS: Record<string, { bg: string; shadow: string }> = {
            blue: { bg: "linear-gradient(135deg, #42A5F5, #1976D2)", shadow: "rgba(25, 118, 210, 0.35)" },
            orange: { bg: "linear-gradient(135deg, #FF7043, #D84315)", shadow: "rgba(216, 67, 21, 0.35)" },
            purple: { bg: "linear-gradient(135deg, #AB47BC, #7B1FA2)", shadow: "rgba(123, 31, 162, 0.35)" },
          };
          const tc = THEME_COLORS[tab.theme] || THEME_COLORS.blue;
          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center gap-1 px-3 py-1 transition-all duration-200"
              data-testid={`tab-${tab.key}`}
            >
              <span
                className="inline-flex items-center justify-center transition-all duration-200"
                style={isActive ? {
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: tc.bg,
                  boxShadow: `0 3px 8px ${tc.shadow}, inset 0 1px 1px rgba(255,255,255,0.3)`,
                } : {
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "transparent",
                }}
              >
                <Icon
                  className="transition-all duration-200"
                  style={{
                    width: 18,
                    height: 18,
                    color: isActive ? "#FFFFFF" : "#9ca3af",
                    filter: isActive ? "drop-shadow(0 1px 1px rgba(0,0,0,0.15))" : "none",
                  }}
                  strokeWidth={isActive ? 2.2 : 1.5}
                />
              </span>
              <span
                className={`text-[10px] leading-tight transition-colors duration-200 ${isActive ? "font-semibold" : "font-medium"}`}
                style={{ color: isActive ? "#1a1a1a" : "#9ca3af" }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
