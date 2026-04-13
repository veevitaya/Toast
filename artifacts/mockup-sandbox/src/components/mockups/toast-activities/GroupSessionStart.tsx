import React from 'react';
import { ArrowLeft, Users, Share2, Check } from 'lucide-react';

export function GroupSessionStart() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative pb-10">
      {/* Safe Area */}
      <div className="h-[44px] w-full" />

      {/* Header */}
      <div className="px-6 flex items-center justify-between">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-900" strokeWidth={1.5} />
        </button>
        <div className="bg-[#FFCC02]/10 rounded-full px-3 py-1 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#CC9900]" strokeWidth={2} />
          <span className="text-[12px] font-semibold text-[#CC9900]">Group mode</span>
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 mt-6">
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-neutral-900 leading-[1.1]">
          What are we doing
          <br />
          tonight?
        </h1>
        <p className="text-[14px] font-medium text-neutral-500 mt-2">
          Get everyone's vibe, find the perfect fit
        </p>
      </div>

      {/* Session Code */}
      <div className="mx-6 mt-6 bg-white rounded-2xl p-4 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
          Session code
        </div>
        <div className="text-[28px] font-black tracking-[0.15em] text-neutral-900 mt-1">
          TOAST-4829
        </div>
        <div className="text-[11px] font-medium text-neutral-400 mt-1">
          Tap to copy
        </div>
      </div>

      {/* Invite CTA */}
      <div className="px-6 mt-4">
        <button className="bg-[#06C755] h-14 rounded-2xl text-white font-bold w-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <Share2 className="w-5 h-5 text-white" strokeWidth={2} />
          <span>Invite via LINE</span>
        </button>
      </div>

      {/* Participants */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
            Who's joining
          </div>
          <div className="text-[13px] font-medium text-neutral-500">
            3 of 4 joined
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-neutral-100 rounded-full w-full overflow-hidden">
          <div className="h-full bg-[#FFCC02] w-3/4 rounded-full" />
        </div>

        {/* Participant List */}
        <div className="mt-4 flex flex-col gap-3">
          {/* Ploy - Host */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                alt="Ploy" 
                className="w-11 h-11 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#06C755] border-2 border-[#FAFAF8] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-neutral-900">Ploy</span>
              <span className="text-[13px] font-medium text-neutral-500">You · Host</span>
            </div>
          </div>

          {/* Beam - Joined */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" 
                alt="Beam" 
                className="w-11 h-11 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#06C755] border-2 border-[#FAFAF8] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-neutral-900">Beam</span>
              <span className="text-[13px] font-medium text-[#06C755]">Joined</span>
            </div>
          </div>

          {/* Fern - Joined */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80" 
                alt="Fern" 
                className="w-11 h-11 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#06C755] border-2 border-[#FAFAF8] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-neutral-900">Fern</span>
              <span className="text-[13px] font-medium text-[#06C755]">Joined</span>
            </div>
          </div>

          {/* Ice - Waiting */}
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-11 h-11 rounded-full bg-neutral-200 flex items-center justify-center text-[16px] font-bold text-neutral-400">
              IC
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-neutral-900">Ice</span>
              <span className="text-[13px] font-medium text-neutral-500">Waiting...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Start CTA */}
      <div className="px-6 mt-6">
        <button className="bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 w-full opacity-70 cursor-not-allowed">
          Start vibe selection
        </button>
        <p className="text-[12px] font-medium text-neutral-400 text-center mt-3">
          Waiting for Ice to join...
        </p>
      </div>
    </div>
  );
}
