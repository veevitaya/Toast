import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export function GroupConsensus() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col shadow-2xl">
      {/* Safe Area */}
      <div className="h-[44px] shrink-0" />
      
      {/* Header */}
      <div className="px-6 flex items-center gap-3 shrink-0">
        <button className="w-10 h-10 flex items-center justify-center -ml-2 text-neutral-900">
          <ArrowLeft className="w-6 h-6" strokeWidth={2} />
        </button>
        <h1 className="text-[18px] font-bold text-neutral-900">Group pick</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 scrollbar-hide">
        {/* Consensus Meter */}
        <div className="px-6 mt-4">
          <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col items-center">
            <div className="text-[15px] font-bold text-emerald-700 mb-4 flex items-center gap-2">
              3 of 4 are good with this <span>✅</span>
            </div>
            
            <div className="flex justify-center -space-x-3">
              {[
                { id: 'ploy', overlay: 'check', z: 40 },
                { id: 'beam', overlay: 'check', z: 30 },
                { id: 'fern', overlay: 'check', z: 20 },
                { id: 'ice', overlay: 'thumb', z: 10 },
              ].map((user) => (
                <div key={user.id} className={`relative`} style={{ zIndex: user.z }}>
                  <div className="w-10 h-10 rounded-full border-[2.5px] border-emerald-50 overflow-hidden bg-neutral-200 relative">
                    <img 
                      src={`https://i.pravatar.cc/150?u=${user.id}`} 
                      alt={user.id}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] rounded-full mix-blend-overlay"></div>
                  </div>
                  {user.overlay === 'check' ? (
                    <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-[#06C755] rounded-full border-2 border-emerald-50 flex items-center justify-center shadow-sm">
                      <svg width="8" height="6" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-white rounded-full border-[1.5px] border-emerald-50 flex items-center justify-center text-[10px] shadow-sm leading-none pt-[1px]">
                      👍
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero result card */}
        <div className="px-6 mt-4">
          <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border border-neutral-100/50">
            <div className="relative h-[200px]">
              <img 
                src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&auto=format&fit=crop&q=80" 
                alt="Tichuca Rooftop Bar" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent mix-blend-multiply"></div>
              <div className="absolute top-3 left-3 bg-[#FFCC02] rounded-full px-3 py-1.5 text-[12px] font-bold text-neutral-900 shadow-sm flex items-center gap-1.5">
                <span>🏆</span> Best match
              </div>
            </div>
            <div className="p-5">
              <h2 className="text-[22px] font-extrabold text-neutral-900 leading-tight tracking-[-0.01em]">Tichuca Rooftop Bar</h2>
              <p className="text-[14px] text-neutral-500 font-medium mt-1">Nightlife · Thong Lo</p>
              
              <div className="mt-4 bg-[#FFCC02]/10 rounded-xl px-3.5 py-2.5 border border-[#FFCC02]/20">
                <p className="text-[13px] font-semibold text-neutral-700">Fits your group's fun + chill vibe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick reactions */}
        <div className="px-6 mt-4">
          <div className="flex gap-2">
            <button className="flex-[1.2] bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl py-2.5 text-[13px] font-bold shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1.5">
              <span>❤️</span> Love it
            </button>
            <button className="flex-[1.4] bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl py-2.5 text-[13px] font-bold shadow-sm relative overflow-hidden active:scale-95 transition-transform flex items-center justify-center gap-1.5">
              <span className="relative z-10 flex items-center gap-1.5"><span>👍</span> Okay <span className="text-emerald-900/40 font-black text-[11px] ml-0.5">(3)</span></span>
              <div className="absolute inset-y-0 left-0 w-[75%] bg-[#06C755]/10 z-0"></div>
            </button>
            <button className="flex-[0.8] bg-white border border-neutral-200 text-neutral-500 rounded-2xl py-2.5 text-[13px] font-bold shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1.5">
              <span>⏭️</span> Skip
            </button>
          </div>
        </div>

        {/* Alternative options */}
        <div className="px-6 mt-8">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.08em] text-neutral-400 mb-3">
            Other options
          </h3>
          <div className="flex flex-col gap-2.5">
            <button className="bg-white rounded-2xl p-2 border border-neutral-100 flex items-center gap-3.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-transform text-left">
              <img 
                src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&auto=format&fit=crop&q=60" 
                alt="Jazz at Saxophone" 
                className="w-[64px] h-[64px] rounded-xl object-cover shadow-sm"
              />
              <div className="flex-1 min-w-0 py-1">
                <h4 className="text-[15px] font-bold text-neutral-900 truncate tracking-tight">Jazz at Saxophone</h4>
                <p className="text-[13px] text-neutral-500 truncate font-medium mt-0.5">Easy compromise</p>
              </div>
              <div className="w-8 h-8 flex items-center justify-center text-neutral-300 mr-1">
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </button>
            
            <button className="bg-white rounded-2xl p-2 border border-neutral-100 flex items-center gap-3.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-transform text-left">
              <img 
                src="https://images.unsplash.com/photo-1518972553623-2287f3942005?w=400&auto=format&fit=crop&q=60" 
                alt="Escape Hunt" 
                className="w-[64px] h-[64px] rounded-xl object-cover shadow-sm"
              />
              <div className="flex-1 min-w-0 py-1">
                <h4 className="text-[15px] font-bold text-neutral-900 truncate tracking-tight">Escape Hunt</h4>
                <p className="text-[13px] text-neutral-500 truncate font-medium mt-0.5">Fun wildcard</p>
              </div>
              <div className="w-8 h-8 flex items-center justify-center text-neutral-300 mr-1">
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className="px-6 mt-8 pb-6">
          <button className="w-full bg-[#FFCC02] text-neutral-900 font-extrabold text-[16px] rounded-[18px] h-[56px] shadow-[0_4px_20px_-2px_rgba(255,204,2,0.4)] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            This works for us! 🎉
          </button>
          
          <div className="flex gap-2.5 mt-3">
            <button className="flex-1 bg-white border-2 border-neutral-100 text-neutral-700 font-bold text-[14px] rounded-[16px] h-[50px] shadow-sm active:scale-[0.98] transition-transform">
              Compare options
            </button>
            <button className="flex-1 bg-white border-2 border-neutral-100 text-neutral-700 font-bold text-[14px] rounded-[16px] h-[50px] shadow-sm active:scale-[0.98] transition-transform">
              Add food
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
