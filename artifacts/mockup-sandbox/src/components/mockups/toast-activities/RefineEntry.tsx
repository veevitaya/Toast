import React, { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

const CHIP_OPTIONS = [
  "💰 Too expensive",
  "📍 Too far",
  "😴 Too boring",
  "👥 Too crowded",
  "🚫 Not my vibe",
  "🎉 More fun",
  "🍃 More chill",
  "🏠 Indoor only",
  "🌳 Outdoor only",
  "⚡ Faster / easier",
  "💎 More unique",
  "👯 Better for groups"
];

export function RefineEntry() {
  const [selectedChips, setSelectedChips] = useState<string[]>([
    "💰 Too expensive",
    "🎉 More fun"
  ]);

  const toggleChip = (chip: string) => {
    setSelectedChips(prev => 
      prev.includes(chip) 
        ? prev.filter(c => c !== chip)
        : [...prev, chip]
    );
  };

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col shadow-xl">
      {/* Safe Area */}
      <div className="h-[44px] w-full bg-[#FAFAF8]" />

      {/* Header */}
      <div className="flex items-center px-6 h-14">
        <button className="w-10 h-10 -ml-2 flex items-center justify-center text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <h1 className="text-[18px] font-bold text-neutral-900 ml-2">Refine</h1>
      </div>

      {/* Hero */}
      <div className="px-6 mt-4">
        <h2 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-tight">
          Not quite right?
        </h2>
        <p className="text-[14px] font-medium text-neutral-500 mt-2">
          Let's adjust it
        </p>
      </div>

      {/* Refine Chips */}
      <div className="px-6 mt-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400 mb-4">
          Tell us what to fix
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          {CHIP_OPTIONS.map((chip) => {
            const isSelected = selectedChips.includes(chip);
            return (
              <button
                key={chip}
                onClick={() => toggleChip(chip)}
                className={`
                  rounded-full px-4 py-2.5 text-[13px] font-medium cursor-pointer border transition-all duration-200
                  ${isSelected 
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md transform scale-[1.02]' 
                    : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
                  }
                `}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Summary */}
      {selectedChips.length > 0 && (
        <div className="px-6 mt-6">
          <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-100">
            <p className="text-[13px] font-medium text-neutral-700 leading-relaxed">
              <span className="text-neutral-500">Adjusting:</span>{' '}
              {selectedChips.join(" + ")}
            </p>
          </div>
        </div>
      )}

      {/* Spacer to push CTA to bottom */}
      <div className="flex-grow" />

      {/* CTA Bottom */}
      <div className="px-6 pb-10 pt-6 mt-auto bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent">
        <button className="w-full bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <Sparkles className="w-5 h-5" strokeWidth={2} />
          Show better options
        </button>
        <button className="w-full text-center mt-4 text-[13px] font-medium text-neutral-400 py-2 active:text-neutral-600 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
