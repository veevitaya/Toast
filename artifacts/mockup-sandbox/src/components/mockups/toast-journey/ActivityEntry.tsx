import React from "react";
import { ArrowLeft, ChevronRight, UtensilsCrossed } from "lucide-react";

export function ActivityEntry() {
  const moods = [
    { emoji: "🍃", label: "Chill" },
    { emoji: "🎉", label: "Fun", selected: true },
    { emoji: "💫", label: "Date Night" },
    { emoji: "🧗", label: "Adventurous" },
    { emoji: "👯", label: "Social" },
    { emoji: "🎨", label: "Artsy" },
    { emoji: "⚡", label: "Active" },
    { emoji: "💰", label: "Budget" },
    { emoji: "👑", label: "Premium" },
  ];

  const activities = [
    {
      name: "Escape Hunt",
      type: "Escape Room",
      location: "Siam",
      image: "https://images.unsplash.com/photo-1543160408-db0e8790cb93?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Blu-O Bowling",
      type: "Bowling",
      location: "Sukhumvit",
      image: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=400&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative">
      {/* Safe Area */}
      <div className="h-[44px] w-full bg-transparent" />

      {/* Header */}
      <div className="px-6 pt-4 flex items-center justify-between">
        <button className="w-10 h-10 rounded-full bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-center text-neutral-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden border border-neutral-100">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 mt-4">
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-tight">
          What are we in
          <br />
          the mood for?
        </h1>
      </div>

      {/* Mood Chips */}
      <div className="px-6 mt-6 grid grid-cols-3 gap-2">
        {moods.map((mood, idx) => (
          <button
            key={idx}
            className={`rounded-2xl px-2 py-3 flex flex-col items-center justify-center gap-1 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border transition-colors ${
              mood.selected
                ? "bg-neutral-900 border-neutral-900 text-white"
                : "bg-white border-neutral-100 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            <span className="text-[20px] leading-none">{mood.emoji}</span>
            <span
              className={`text-[12px] font-semibold ${
                mood.selected ? "text-white" : "text-neutral-700"
              }`}
            >
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {/* Activity Preview */}
      <div className="mt-8">
        <div className="px-6 flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-neutral-900">
            Fun activities nearby
          </h2>
          <button className="flex items-center text-[13px] font-semibold text-neutral-500">
            See all <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {/* Horizontal Scroll Area */}
        <div className="px-6 flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {activities.map((activity, idx) => (
            <div
              key={idx}
              className="w-[200px] flex-shrink-0 rounded-2xl overflow-hidden bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] snap-start"
            >
              <div className="h-[120px] w-full bg-neutral-100 relative">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-[14px] text-neutral-900 truncate">
                  {activity.name}
                </h3>
                <p className="text-[12px] text-neutral-500 mt-0.5 truncate">
                  {activity.type} • {activity.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Bridge Prompt */}
      <div className="mx-6 mt-4 bg-[#FFCC02]/5 rounded-2xl p-4 border border-[#FFCC02]/15">
        <div className="flex items-center gap-2 mb-1">
          <UtensilsCrossed className="w-4 h-4 text-[#CC9900]" />
          <h3 className="text-[14px] font-semibold text-neutral-900">
            Add food to your plan?
          </h3>
        </div>
        <p className="text-[12px] text-neutral-500">
          Find food before or after your activity
        </p>

        <div className="flex gap-2 mt-3">
          <button className="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-[13px] font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5">
            <span>🍜</span> Food before
          </button>
          <button className="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-[13px] font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5">
            <span>🍜</span> Food after
          </button>
        </div>
      </div>
      
      {/* Add global hide-scrollbar style */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
