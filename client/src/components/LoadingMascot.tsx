import mascotImg from "@assets/IMG_9683_1772911610867.jpeg";

export function LoadingMascot({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const imgSize = size === "sm" ? "h-14 w-14" : size === "lg" ? "h-28 w-28" : "h-20 w-20";

  return (
    <div className="flex items-center justify-center">
      <img
        src={mascotImg}
        alt="Toast mascot waiting"
        className={`${imgSize} object-contain animate-soft-bob gpu-accelerated`}
        draggable={false}
      />
    </div>
  );
}
