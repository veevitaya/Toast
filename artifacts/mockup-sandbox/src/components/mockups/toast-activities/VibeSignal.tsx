import React, { useState } from 'react';
import { Check } from 'lucide-react';

const vibes = [
  { id: 'chill', emoji: '🍃', label: 'Chill' },
  { id: 'drinks', emoji: '🍹', label: 'Drinks' },
  { id: 'fun', emoji: '🎉', label: 'Fun' },
  { id: 'budget', emoji: '💰', label: 'Budget' },
  { id: 'nice', emoji: '✨', label: 'Nice' },
  { id: 'artsy', emoji: '🎨', label: 'Artsy' },
  { id: 'quick', emoji: '⚡', label: 'Quick' },
  { id: 'date', emoji: '💫', label: 'Date' },
  { id: 'active', emoji: '🏃', label: 'Active' },
  { id: 'low-effort', emoji: '🛋️', label: 'Low effort' },
  { id: 'loud', emoji: '🔊', label: 'Loud' },
  { id: 'calm', emoji: '🕯️', label: 'Calm' },
];

export function VibeSignal() {
  const [selected, setSelected] = useState<string[]>(['chill', 'fun']);
  const [strong, setStrong] = useState<string | null>('fun');

  const toggleVibe = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(v => v !== id));
      if (strong === id) setStrong(null);
    } else {
      if (selected.length < 2) {
        setSelected([...selected, id]);
      } else {
        const keep = strong ? strong : selected[1];
        setSelected([keep, id]);
      }
    }
  };

  const setStrongVibe = (id: string) => {
    if (!selected.includes(id)) {
      if (selected.length < 2) {
        setSelected([...selected, id]);
      } else {
        setSelected([selected[0], id]);
      }
    }
    setStrong(id);
  };

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col">
      {/* Safe Area */}
      <div className="h-[44px] w-full shrink-0" />

      {/* Participant Row */}
      <div className="px-6 flex items-center gap-2">
        <div className="relative">
          <img src="https://i.pravatar.cc/150?u=ploy" alt="Ploy" className="w-9 h-9 rounded-full ring-2 ring-white object-cover shadow-sm" />
          <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-[#06C755] rounded-full flex items-center justify-center border-2 border-white text-white">
            <Check className="w-2.5 h-2.5" strokeWidth={3} />
          </div>
        </div>
        <div className="relative">
          <img src="https://i.pravatar.cc/150?u=mick" alt="Mick" className="w-9 h-9 rounded-full ring-2 ring-white object-cover shadow-sm" />
          <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center border border-neutral-200">
            <div className="flex gap-[2px]">
              <div className="w-[3px] h-[3px] bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-[3px] h-[3px] bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-[3px] h-[3px] bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
        <div className="relative">
          <img src="https://i.pravatar.cc/150?u=jane" alt="Jane" className="w-9 h-9 rounded-full ring-2 ring-white object-cover shadow-sm" />
          <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center border border-neutral-200">
            <div className="flex gap-[2px]">
              <div className="w-[3px] h-[3px] bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-[3px] h-[3px] bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-[3px] h-[3px] bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
        <div className="relative">
          <img src="https://i.pravatar.cc/150?u=you" alt="You" className="w-9 h-9 rounded-full ring-2 ring-white object-cover shadow-sm" />
          <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center border border-neutral-200">
            <div className="flex gap-[2px]">
              <div className="w-[3px] h-[3px] bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-[3px] h-[3px] bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-[3px] h-[3px] bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 mt-4">
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-[1.1]">
          What are you in<br />the mood for?
        </h1>
        <p className="text-[13px] text-neutral-500 mt-2 font-medium">
          Pick 1–2 vibes · Long press your strongest
        </p>
      </div>

      {/* Vibe Grid */}
      <div className="px-6 mt-6 grid grid-cols-3 gap-2.5">
        {vibes.map((vibe) => {
          const isSelected = selected.includes(vibe.id);
          const isStrong = strong === vibe.id;
          
          return (
            <div
              key={vibe.id}
              onClick={() => toggleVibe(vibe.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setStrongVibe(vibe.id);
              }}
              className={`
                rounded-2xl p-3 text-center cursor-pointer border transition-all duration-200 select-none
                ${isSelected && !isStrong ? 'bg-neutral-900 border-neutral-900 text-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.15)]' : ''}
                ${isStrong ? 'bg-neutral-900 border-neutral-900 text-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.15)] ring-2 ring-[#FFCC02] ring-offset-2 ring-offset-[#FAFAF8]' : ''}
                ${!isSelected && !isStrong ? 'bg-white border-neutral-100 text-neutral-700 hover:border-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]' : ''}
              `}
            >
              <div className="text-[22px] leading-none mb-1">{vibe.emoji}</div>
              <div className={`text-[12px] font-semibold ${isSelected ? 'text-white' : 'text-neutral-700'}`}>
                {vibe.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection Summary */}
      <div className="px-6 mt-6">
        <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 flex items-center justify-center">
          <p className="text-[13px] text-neutral-700 font-medium text-center">
            Your picks: 🍃 Chill + 🎉 Fun (strongest)
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 mt-auto mb-10 pt-4">
        <button className="w-full bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] transition-transform active:scale-[0.98]">
          Submit my vibes
        </button>
        <p className="text-[11px] text-neutral-400 text-center mt-3 italic font-medium">
          Your picks are private until everyone submits
        </p>
      </div>
    </div>
  );
}