import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export function ActivityMoodEntry() {
  const [mode, setMode] = useState<'solo' | 'friends'>('solo');
  const [selectedMood, setSelectedMood] = useState<string>('Chill');

  const moods = [
    { emoji: '🍃', label: 'Chill', sub: 'Wind down' },
    { emoji: '🎉', label: 'Fun', sub: 'Games & laughs' },
    { emoji: '💫', label: 'Date night', sub: 'Romantic' },
    { emoji: '🧗', label: 'Adventurous', sub: 'Try something new' },
    { emoji: '👯', label: 'Social', sub: 'Meet & mix' },
    { emoji: '🎨', label: 'Artsy', sub: 'Creative vibes' },
    { emoji: '⚡', label: 'Active', sub: 'Get moving' },
    { emoji: '💰', label: 'Budget', sub: 'Keep it light' },
    { emoji: '👑', label: 'Premium', sub: 'Treat yourself' },
    { emoji: '🛋️', label: 'Low effort', sub: 'Easy & close' },
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col">
      {/* Safe area */}
      <div className="h-[44px] shrink-0" />

      {/* Header */}
      <div className="px-6 flex items-center justify-between">
        <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
          <ChevronLeft className="w-5 h-5 text-neutral-900" strokeWidth={1.5} />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('solo')}
            className={`px-4 py-2.5 rounded-full font-semibold text-[13px] transition-colors ${
              mode === 'solo' 
                ? 'bg-neutral-900 text-white' 
                : 'bg-white border border-neutral-200 text-neutral-700'
            }`}
          >
            Solo
          </button>
          <button
            onClick={() => setMode('friends')}
            className={`px-4 py-2.5 rounded-full font-semibold text-[13px] transition-colors ${
              mode === 'friends' 
                ? 'bg-neutral-900 text-white' 
                : 'bg-white border border-neutral-200 text-neutral-700'
            }`}
          >
            With friends
          </button>
        </div>
      </div>

      {/* Context badge */}
      <div className="px-6 mt-3">
        <div className="inline-flex items-center bg-emerald-50 rounded-full px-3 py-1">
          <span className="text-[12px] font-semibold text-emerald-700">✅ Dinner locked in · Thipsamai</span>
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 mt-4">
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-tight">
          What fits after<br />dinner tonight?
        </h1>
        <p className="text-[14px] font-medium text-neutral-500 mt-2">
          We'll help narrow it down
        </p>
      </div>

      {/* Mood cards */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-3 flex-1 pb-24">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.label;
          return (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood.label)}
              className={`rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-neutral-900 border border-neutral-900 shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                  : 'bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-neutral-200'
              }`}
            >
              <div className="text-[20px] leading-none shrink-0">{mood.emoji}</div>
              <div className="flex flex-col min-w-0">
                <span className={`text-[14px] font-semibold truncate ${isSelected ? 'text-white' : 'text-neutral-800'}`}>
                  {mood.label}
                </span>
                <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] truncate ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`}>
                  {mood.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer / CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-6 pb-8 pt-4 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent">
        <button className="w-full h-14 bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] flex items-center justify-center text-[16px]">
          Show best fits
        </button>
        <button className="w-full text-[13px] font-medium text-neutral-400 text-center mt-3 py-2">
          Change mood
        </button>
      </div>
    </div>
  );
}
