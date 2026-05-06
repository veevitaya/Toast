import toastImg from "@/assets/mascots/toast-mascot.png";
import waffleImg from "@/assets/mascots/waffle-mascot.png";
import popcornImg from "@/assets/mascots/popcorn-mascot.png";
import ticketImg from "@/assets/mascots/ticket-mascot.png";
import groupImg from "@/assets/mascots/mascot-group-hero.png";

export type MascotName = "toast" | "waffle" | "popcorn" | "ticket" | "group";
export type MascotSize = "xs" | "sm" | "md" | "lg" | "xl" | "hero";

const SRC: Record<MascotName, string> = {
  toast: toastImg,
  waffle: waffleImg,
  popcorn: popcornImg,
  ticket: ticketImg,
  group: groupImg,
};

const ALT: Record<MascotName, string> = {
  toast: "Toast mascot — friendly slice of bread with butter",
  waffle: "Waffle mascot — round waffle with ice cream scoop",
  popcorn: "Popcorn bucket mascot",
  ticket: "Event ticket mascot",
  group: "Toast, Waffle, Popcorn and Ticket mascots together",
};

const SIZE_CLASS: Record<MascotSize, string> = {
  xs: "w-8 h-8",
  sm: "w-14 h-14",
  md: "w-20 h-20",
  lg: "w-28 h-28",
  xl: "w-40 h-40",
  hero: "w-full max-w-md h-auto",
};

interface MascotProps {
  name: MascotName;
  size?: MascotSize;
  className?: string;
  spin?: boolean;
  bounce?: boolean;
}

export function Mascot({ name, size = "md", className = "", spin = false, bounce = false }: MascotProps) {
  const animate = bounce ? "animate-[bounce_2.5s_ease-in-out_infinite]" : spin ? "animate-spin" : "";
  return (
    <img
      src={SRC[name]}
      alt={ALT[name]}
      className={`${SIZE_CLASS[size]} object-contain select-none pointer-events-none ${animate} ${className}`}
      data-testid={`mascot-${name}`}
      draggable={false}
    />
  );
}

interface MascotPairProps {
  variant: "food" | "events";
  size?: MascotSize;
  className?: string;
}

export function MascotPair({ variant, size = "md", className = "" }: MascotPairProps) {
  const [a, b]: [MascotName, MascotName] = variant === "food" ? ["toast", "waffle"] : ["popcorn", "ticket"];
  return (
    <div className={`flex items-end -space-x-3 ${className}`} data-testid={`mascot-pair-${variant}`}>
      <Mascot name={a} size={size} />
      <Mascot name={b} size={size} className="translate-y-1" />
    </div>
  );
}

export function mascotForCategory(category: string): MascotName {
  switch (category) {
    case "user_feedback": return "toast";
    case "restaurant_partner": return "waffle";
    case "event_activity_partner": return "popcorn";
    case "general_partner": return "ticket";
    default: return "group";
  }
}
