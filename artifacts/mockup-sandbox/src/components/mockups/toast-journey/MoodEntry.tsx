import React from 'react';
import { Sparkles, ChevronRight, Home, Compass, Bookmark, User } from 'lucide-react';

export function MoodEntry() {
  const moodCards = [
    {
      emoji: "🍜",
      title: "Hungry now",
      subtext: "Let's find food",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
    },
    {
      emoji: "🎯",
      title: "Something fun",
      subtext: "Activities & games",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80"
    },
    {
      emoji: "🌙",
      title: "Night out",
      subtext: "Drinks & nightlife",
      image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&auto=format&fit=crop&q=80"
    },
    {
      emoji: "💫",
      title: "Date vibe",
      subtext: "Romantic & special",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80"
    },
    {
      emoji: "⚡",
      title: "Quick & easy",
      subtext: "Something nearby, fast",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative pb-20">
      {/* Safe Area */}
      <div className="h-[44px]" />

      {/* Header */}
      <div className="px-6 pt-4 flex items-center justify-between">
        <div className="w-8 h-8 rounded-xl bg-[#FFCC02] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-neutral-900" strokeWidth={2} />
        </div>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          alt="User profile"
          className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
        />
      </div>

      {/* Hero Text */}
      <div className="px-6 mt-8">
        <h2 className="text-[14px] font-medium text-neutral-500 mb-1">What are we</h2>
        <h1 className="text-[32px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-tight">feeling tonight?</h1>
      </div>

      {/* Mood Cards */}
      <div className="px-6 mt-8 flex flex-col gap-3">
        {moodCards.map((card, index) => (
          <div
            key={index}
            className="w-full h-[72px] rounded-2xl overflow-hidden relative cursor-pointer group shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-100/50"
          >
            <img
              src={card.image}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />

            <div className="relative h-full px-5 flex items-center gap-4">
              <div className="text-[24px]">{card.emoji}</div>
              <div className="flex-1">
                <h3 className="text-[16px] font-bold text-white leading-tight">{card.title}</h3>
                <p className="text-[12px] font-medium text-white/80">{card.subtext}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      {/* Group Badge */}
      <div className="mt-6 flex justify-center">
        <div className="bg-white rounded-2xl px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-100 inline-flex items-center gap-3 cursor-pointer active:scale-95 transition-transform">
          <div className="flex -space-x-2">
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm" alt="Friend 1" />
            <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm" alt="Friend 2" />
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm" alt="Friend 3" />
          </div>
          <span className="text-[13px] font-semibold text-neutral-700">With 3 friends</span>
          <ChevronRight className="w-4 h-4 text-neutral-400" strokeWidth={2} />
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-white border-t border-neutral-100 flex items-center justify-around px-6 pb-4 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <div className="relative">
            <Home className="w-6 h-6 text-neutral-900" strokeWidth={2} />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FFCC02] rounded-full border-2 border-white" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <Compass className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <Bookmark className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <User className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
