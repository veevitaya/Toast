import React, { useState } from 'react';
import { ArrowLeft, User, Sparkles } from 'lucide-react';

export function SoloQuickStart() {
  const [selectedChips, setSelectedChips] = useState<string[]>([
    'Tonight', 'Near me', 'After dinner'
  ]);

  const chips = [
    { id: 'Tonight', label: '🌙 Tonight' },
    { id: 'Near me', label: '📍 Near me' },
    { id: 'After dinner', label: '🍽️ After dinner' },
    { id: 'Indoor', label: '🏠 Indoor' },
    { id: 'Outdoor', label: '🌳 Outdoor' },
    { id: 'Budget', label: '💰 Budget' },
    { id: 'Premium', label: '👑 Premium' }
  ];

  const toggleChip = (id: string) => {
    setSelectedChips(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col">
      {/* Safe area */}
      <div className="h-[44px] w-full shrink-0" />

      {/* Header */}
      <div className="px-6 flex items-center justify-between shrink-0">
        <button className="w-10 h-10 flex items-center justify-center -ml-2 text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
        </button>
        <div className="flex items-center gap-2 text-neutral-500 bg-white px-3 py-1.5 rounded-full border border-neutral-100 shadow-sm">
          <User className="w-3.5 h-3.5" strokeWidth={2} />
          <span className="text-[13px] font-semibold">Solo mode</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {/* Selected mood hero */}
        <div className="px-6 mt-8 flex flex-col items-center">
          <div className="text-[48px] leading-none mb-4">🍃</div>
          <h1 className="text-[32px] font-extrabold text-neutral-900 text-center tracking-[-0.03em]">
            Chill
          </h1>
          <p className="text-[14px] text-neutral-500 text-center mt-1 font-medium">
            After dinner · Tonight
          </p>
        </div>

        {/* Context refinement chips */}
        <div className="px-6 mt-10">
          <h2 className="text-[11px] uppercase tracking-[0.08em] font-semibold text-neutral-400 mb-3">
            Narrow it down
          </h2>
          <div className="flex flex-wrap gap-2">
            {chips.map(chip => {
              const isSelected = selectedChips.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  onClick={() => toggleChip(chip.id)}
                  className={`rounded-full px-4 py-2.5 text-[13px] font-semibold transition-all ${
                    isSelected 
                      ? 'bg-neutral-900 text-white shadow-md' 
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-300 shadow-sm'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacer for illustration */}
        <div className="flex-1 flex items-center justify-center min-h-[160px] py-6">
          {/* Abstract illustration */}
          <div className="relative w-[100px] h-[70px] opacity-60">
            <div className="absolute inset-0 bg-white rounded-xl shadow-sm border border-neutral-100 transform -rotate-3 transition-transform duration-700 hover:-rotate-6" />
            <div className="absolute inset-0 bg-white rounded-xl shadow-sm border border-neutral-100 transform rotate-3 transition-transform duration-700 hover:rotate-6" />
            <div className="absolute inset-0 bg-white rounded-xl shadow-sm border border-neutral-100 transform rotate-0 z-10 transition-transform duration-700 hover:scale-105" />
            
            {/* Subtle inner details */}
            <div className="absolute inset-x-2 top-2 bottom-6 bg-neutral-50 rounded-lg transform -rotate-3" />
            <div className="absolute inset-x-2 top-2 bottom-6 bg-neutral-50 rounded-lg transform rotate-3" />
            <div className="absolute inset-x-2 top-2 bottom-6 bg-neutral-50 rounded-lg transform rotate-0 z-10" />
            <div className="absolute bottom-2 left-2 w-6 h-1.5 bg-neutral-100 rounded-full z-10" />
            <div className="absolute bottom-2 right-2 w-3 h-1.5 bg-neutral-100 rounded-full z-10" />
          </div>
        </div>

        {/* CTA area */}
        <div className="px-6 pb-12 pt-6 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent">
          <button className="bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 w-full flex items-center justify-center gap-2 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] hover:bg-[#F0C000] transition-colors active:scale-[0.98]">
            <Sparkles className="w-5 h-5" />
            <span className="text-[16px]">Show best fits</span>
          </button>
          
          <button className="w-full text-[13px] text-neutral-400 font-semibold text-center mt-4 hover:text-neutral-600 transition-colors">
            Change mood
          </button>
        </div>
      </div>
    </div>
  );
}
