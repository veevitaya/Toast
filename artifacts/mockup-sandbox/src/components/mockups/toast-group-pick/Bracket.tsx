import React, { useState } from 'react';
import { ChevronLeft, Trophy, Users, CheckCircle2 } from 'lucide-react';

export function Bracket() {
  const [votedFor, setVotedFor] = useState<string | null>(null);

  return (
    <div 
      className="relative mx-auto bg-[#FAF6EF] overflow-hidden shadow-2xl"
      style={{ 
        width: '390px', 
        height: '844px', 
        fontFamily: "'Figtree', system-ui, sans-serif",
        color: '#0F172A'
      }}
    >
      {/* Header */}
      <div className="pt-14 pb-4 px-6 flex items-center justify-between">
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_1px_2px_rgba(16,24,40,0.05)] border border-[#0F172A]/5">
          <ChevronLeft className="w-5 h-5 text-[#0F172A]" />
        </button>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-[0_1px_2px_rgba(16,24,40,0.05)] border border-[#0F172A]/5">
          <Trophy className="w-4 h-4 text-[#FFCC02]" />
          <span className="text-sm font-bold tracking-tight">Tiebreaker</span>
        </div>
        <div className="w-10 h-10" />
      </div>

      <div className="px-6 mt-4">
        <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
          Playoff Bracket
        </h1>
        <p className="text-[#6B7280] text-base mt-2">
          4 options tied. The group votes to advance!
        </p>
      </div>

      {/* Bracket Visualization */}
      <div className="mt-8 px-6 relative">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-[#0F172A]/10 -z-10" />
        
        {/* Match 1 - Active */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFCC02] bg-[#FFCC02]/10 px-2 py-1 rounded-md">Match 1 • Voting</span>
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] border border-[#FAF6EF] z-20">👩</div>
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[10px] border border-[#FAF6EF] z-10">👦</div>
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] border border-[#FAF6EF] z-0 text-[#6B7280] font-medium">+2</div>
            </div>
          </div>
          
          <div className="bg-white rounded-[20px] p-1 shadow-[0_8px_30px_-6px_rgba(255,204,2,0.25)] border-2 border-[#FFCC02] flex relative overflow-hidden">
            <button 
              onClick={() => setVotedFor('hom-duan')}
              className={`flex-1 p-3 rounded-[16px] text-center transition-all ${votedFor === 'hom-duan' ? 'bg-[#FFCC02]/10' : 'hover:bg-gray-50'}`}
            >
              <div className="text-3xl mb-2">🍜</div>
              <div className="font-bold text-sm truncate">Hom Duan</div>
              <div className="text-xs text-[#6B7280]">Khao Soi</div>
              {votedFor === 'hom-duan' && (
                <div className="absolute top-3 left-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFCC02]" />
                </div>
              )}
            </button>
            <div className="w-px bg-[#0F172A]/5 my-2 mx-1" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-[#6B7280] border border-[#0F172A]/5 shadow-sm">
              VS
            </div>
            <button 
              onClick={() => setVotedFor('baan')}
              className={`flex-1 p-3 rounded-[16px] text-center transition-all ${votedFor === 'baan' ? 'bg-[#FFCC02]/10' : 'hover:bg-gray-50'}`}
            >
              <div className="text-3xl mb-2">🍤</div>
              <div className="font-bold text-sm truncate">Baan Phadthai</div>
              <div className="text-xs text-[#6B7280]">Pad Thai</div>
              {votedFor === 'baan' && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFCC02]" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Connector Line */}
        <div className="w-0.5 h-6 bg-[#0F172A]/10 mx-auto my-2" />

        {/* Match 2 - Upcoming */}
        <div className="relative mt-6 opacity-60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Match 2 • Up Next</span>
          </div>
          <div className="bg-white rounded-[20px] p-1 shadow-[0_1px_2px_rgba(16,24,40,0.05)] border border-[#0F172A]/5 flex relative">
            <div className="flex-1 p-3 rounded-[16px] text-center">
              <div className="text-3xl mb-2 grayscale opacity-50">🥗</div>
              <div className="font-bold text-sm truncate text-[#6B7280]">Err Urban</div>
            </div>
            <div className="w-px bg-[#0F172A]/5 my-2 mx-1" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#FAF6EF] rounded-full flex items-center justify-center text-xs font-bold text-[#6B7280] border border-[#0F172A]/5">
              VS
            </div>
            <div className="flex-1 p-3 rounded-[16px] text-center">
              <div className="text-3xl mb-2 grayscale opacity-50">🥑</div>
              <div className="font-bold text-sm truncate text-[#6B7280]">Roast</div>
            </div>
          </div>
        </div>
        
        {/* Connector to Final */}
        <div className="w-0.5 h-10 bg-[#0F172A]/10 mx-auto my-2 relative">
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#0F172A]/10 bg-[#FAF6EF]" />
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAF6EF] via-[#FAF6EF] to-transparent pt-12 pb-8">
        <div className="bg-white rounded-[24px] p-5 shadow-[0_12px_40px_-10px_rgba(16,24,40,0.1),0_4px_16px_-4px_rgba(16,24,40,0.04)] border border-[#0F172A]/5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex flex-col items-center justify-center overflow-hidden relative">
               {votedFor ? <div className="text-2xl">{votedFor === 'hom-duan' ? '🍜' : '🍤'}</div> : <div className="text-2xl opacity-30">🤔</div>}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight">
                {votedFor ? "Vote locked in!" : "Your turn to vote"}
              </h3>
              <p className="text-[#6B7280] text-sm">
                {votedFor ? "Waiting for 1 more person..." : "Pick a winner for Match 1"}
              </p>
            </div>
          </div>

          <button 
            className={`w-full py-4 rounded-full font-bold text-lg shadow-[0_4px_14px_-3px_rgba(0,0,0,0.1)] transition-all ${votedFor ? 'bg-[#0F172A] text-white hover:scale-[0.98]' : 'bg-gray-100 text-[#6B7280] cursor-not-allowed'}`}
          >
            {votedFor ? "Change Vote" : "Select an option above"}
          </button>
        </div>
      </div>
    </div>
  );
}
