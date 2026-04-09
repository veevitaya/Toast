import React, { useState } from 'react';
import { ChevronLeft, Copy, Check, Share2, CheckCircle2, Loader2 } from 'lucide-react';

export function SessionLobby() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] relative flex flex-col mx-auto">
      {/* Safe area + back arrow */}
      <div className="pt-14 pb-4 px-6 flex items-center">
        <button className="w-10 h-10 rounded-full bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-center text-neutral-900 active:scale-95 transition-transform">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 flex-1 flex flex-col pb-32">
        {/* Session Header */}
        <div className="flex flex-col items-center mt-2 mb-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400 mb-3">
            Your Session
          </span>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-3 bg-neutral-100 rounded-xl px-5 py-3 active:scale-95 transition-transform"
          >
            <span className="text-[24px] font-black tracking-[0.1em] text-neutral-900">
              TOAST-7842
            </span>
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-neutral-500" />
            )}
          </button>
        </div>

        {/* Share Button */}
        <button className="w-full bg-[#06C755] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 mb-8 active:scale-95 transition-transform">
          <Share2 className="w-5 h-5" />
          Share to LINE
        </button>

        {/* Progress Section */}
        <div className="mb-6 mt-8">
          <h2 className="text-[18px] font-bold tracking-[-0.02em] text-neutral-900 mb-4">
            Waiting room
          </h2>
          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#FFCC02] rounded-full w-[75%] transition-all duration-1000 ease-out" />
          </div>
          <p className="text-[13px] font-medium text-neutral-500">
            3 of 4 friends joined
          </p>
        </div>

        {/* Participant List */}
        <div className="flex flex-col bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-4">
          {/* Ploy */}
          <div className="flex items-center py-4 gap-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
              alt="Ploy" 
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="flex-1 flex flex-col">
              <span className="text-[14px] font-semibold text-neutral-900 leading-none mb-1">Ploy</span>
              <span className="text-[12px] font-medium text-neutral-500">You · Host</span>
            </div>
            <div className="flex items-center gap-1 bg-green-50 text-[#06C755] px-2 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="h-px bg-neutral-100" />

          {/* Beam */}
          <div className="flex items-center py-4 gap-3">
            <img 
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" 
              alt="Beam" 
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="flex-1 flex flex-col">
              <span className="text-[14px] font-semibold text-neutral-900 leading-none mb-1">Beam</span>
              <span className="text-[12px] font-medium text-neutral-500">Joined</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 text-[#06C755] px-2.5 py-1 rounded-full font-semibold text-[12px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06C755] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06C755]"></span>
              </span>
              Joined
            </div>
          </div>
          <div className="h-px bg-neutral-100" />

          {/* Fern */}
          <div className="flex items-center py-4 gap-3">
            <img 
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80" 
              alt="Fern" 
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="flex-1 flex flex-col">
              <span className="text-[14px] font-semibold text-neutral-900 leading-none mb-1">Fern</span>
              <span className="text-[12px] font-medium text-neutral-500">Joined</span>
            </div>
            <div className="flex items-center bg-green-50 text-[#06C755] px-2.5 py-1 rounded-full font-semibold text-[12px]">
              Joined
            </div>
          </div>
          <div className="h-px bg-neutral-100" />

          {/* Ice */}
          <div className="flex items-center py-4 gap-3 opacity-70">
            <div className="w-11 h-11 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold text-[14px]">
              IC
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-[14px] font-semibold text-neutral-900 leading-none mb-1">Ice</span>
              <span className="text-[12px] font-medium text-neutral-400">Waiting...</span>
            </div>
            <div className="flex items-center text-neutral-400 px-2 py-1">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-8 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <button className="w-full bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] opacity-70 flex items-center justify-center text-[16px] mb-3 transition-opacity">
            Start Swiping 🍽️
          </button>
          <p className="text-[12px] text-neutral-400 text-center font-medium">
            Waiting for Ice to join...
          </p>
        </div>
      </div>
    </div>
  );
}
