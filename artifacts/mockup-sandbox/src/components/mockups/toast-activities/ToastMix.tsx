import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";

export function ToastMix() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 2 : 0));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const participants = [
    {
      id: "ploy",
      name: "Ploy",
      avatar: "https://i.pravatar.cc/150?u=ploy",
      vibes: ["Chill", "Fun"],
      color: "from-amber-300/60 to-orange-400/40",
      position: "-top-2 -left-2",
      size: "w-[140px] h-[140px]",
      blur: "blur-[20px]",
      delay: "animation-delay-0",
    },
    {
      id: "beam",
      name: "Beam",
      avatar: "https://i.pravatar.cc/150?u=beam",
      vibes: ["Social", "Fun"],
      color: "from-blue-300/50 to-indigo-400/40",
      position: "-top-0 -right-4",
      size: "w-[120px] h-[120px]",
      blur: "blur-[18px]",
      delay: "animation-delay-700",
    },
    {
      id: "fern",
      name: "Fern",
      avatar: "https://i.pravatar.cc/150?u=fern",
      vibes: ["Chill", "Artsy"],
      color: "from-emerald-300/50 to-teal-400/40",
      position: "-bottom-4 -left-0",
      size: "w-[130px] h-[130px]",
      blur: "blur-[18px]",
      delay: "animation-delay-1000",
    },
    {
      id: "ice",
      name: "Ice",
      avatar: "https://i.pravatar.cc/150?u=ice",
      vibes: ["Fun", "Budget"],
      color: "from-pink-300/50 to-rose-400/40",
      position: "-bottom-2 -right-2",
      size: "w-[110px] h-[110px]",
      blur: "blur-[16px]",
      delay: "animation-delay-500",
    },
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col">
      {/* Safe Area */}
      <div className="h-[44px] w-full shrink-0" />

      {/* Participant Row */}
      <div className="px-6 flex justify-center items-center gap-4 mt-2">
        {participants.map((p) => (
          <div key={p.id} className="relative">
            <img
              src={p.avatar}
              alt={p.name}
              className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#06C755] rounded-full flex items-center justify-center border-2 border-white">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="text-center mt-6">
        <h1 className="text-[22px] font-extrabold text-neutral-900 leading-tight">
          Finding what fits
        </h1>
        <h1 className="text-[22px] font-extrabold text-neutral-900 leading-tight">
          all of you...
        </h1>
      </div>

      {/* Toast Mix Visualization */}
      <div className="mt-10 w-[280px] h-[280px] mx-auto relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-neutral-200/50 animate-[spin_20s_linear_infinite]" />
        
        {/* Container for blobs to center them */}
        <div className="relative w-[180px] h-[180px]">
          {/* Blobs */}
          {participants.map((p) => (
            <div
              key={p.id}
              className={`absolute rounded-full bg-gradient-to-br ${p.color} ${p.size} ${p.blur} ${p.position} mix-blend-multiply animate-pulse`}
              style={{ animationDuration: "3s" }}
            />
          ))}

          {/* Center Convergence */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#FFCC02]/90 to-amber-500/70 blur-[10px] mix-blend-overlay animate-pulse" style={{ animationDuration: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-white/60 blur-[4px]" />
        </div>
      </div>

      {/* Status */}
      <div className="text-center mt-12">
        <p className="text-[14px] font-medium text-neutral-500">
          Analyzing 4 vibe signals...
        </p>
        <div className="h-1 w-[120px] mx-auto mt-3 bg-neutral-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#FFCC02] rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Vibe Breakdown */}
      <div className="px-6 mt-10">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 flex flex-col gap-3">
          {participants.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <img
                src={p.avatar}
                alt={p.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-[12px] font-medium text-neutral-700 w-10">
                {p.name}
              </span>
              <div className="flex items-center gap-1.5 flex-1">
                {p.vibes.map((vibe, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 rounded-full px-2.5 py-0.5"
                  >
                    {vibe}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="mt-6 mb-8 text-center px-6">
        <p className="text-[11px] text-neutral-400 italic font-medium">
          Tap an avatar to see their influence
        </p>
      </div>
    </div>
  );
}
