import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Share2, 
  Bookmark, 
  Plus, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export function PlanSummary() {
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  ];

  const steps = [
    {
      id: 1,
      type: 'Dinner',
      name: 'Gaggan Anand',
      category: 'Progressive Indian',
      area: 'Sukhumvit',
      time: '7:00 PM',
      color: 'bg-[#FFCC02] text-neutral-900',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      type: 'Dessert',
      name: 'After You',
      category: 'Cafe & Desserts',
      area: 'Siam',
      time: '9:00 PM',
      color: 'bg-emerald-500 text-white',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      type: 'Drinks',
      name: 'Vesper',
      category: 'Cocktail Bar',
      area: 'Silom',
      time: '10:30 PM',
      color: 'bg-violet-500 text-white',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] flex flex-col relative mx-auto shadow-2xl">
      {/* Header & Hero Area */}
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-b-[32px] pt-12 pb-8 px-6 relative z-10">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
            <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
          </button>
          
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <div key={i} className="w-9 h-9 rounded-full ring-2 ring-neutral-800 shadow-sm overflow-hidden z-[3] relative" style={{ zIndex: 10 - i }}>
                  <img src={src} alt="friend" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-9 h-9 rounded-full ring-2 ring-neutral-800 shadow-sm bg-neutral-700 flex items-center justify-center text-[11px] font-bold text-white z-0 relative">
                +2
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative">
          <Sparkles className="absolute -top-6 -right-2 w-6 h-6 text-[#FFCC02]/40" />
          <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-white leading-tight mb-2">
            Your Night Plan
          </h1>
          <p className="text-[14px] text-white/60 font-medium flex items-center gap-2">
            Friday, 24 Nov 
            <span className="w-1 h-1 rounded-full bg-white/30"></span> 
            5 friends
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="px-6 py-8 flex-1 relative">
        {/* Continuous Vertical Line */}
        <div className="absolute left-[47px] top-[48px] bottom-[40px] w-[2px] bg-neutral-200 z-0"></div>
        
        <div className="space-y-8 relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex gap-4">
              
              {/* Timeline Node */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-[20px] font-black shadow-md ring-4 ring-[#FAFAF8] z-10`}>
                  {step.id}
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400 bg-[#FAFAF8] py-0.5">
                  {step.time}
                </span>
              </div>
              
              {/* Venue Card */}
              <div className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex gap-4 w-full h-fit mt-1">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                  <img src={step.image} alt={step.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-[16px] font-bold tracking-[-0.02em] text-neutral-900 mb-0.5 leading-tight">
                    {step.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-500">
                    <span>{step.category}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                    <span className="flex items-center text-neutral-400">
                      <MapPin className="w-3 h-3 mr-0.5 stroke-[1.5]" />
                      {step.area}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 pt-2 space-y-3 bg-[#FAFAF8] relative z-20">
        <button className="w-full bg-[#06C755] text-white font-bold rounded-2xl h-14 text-[15px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all">
          <Share2 className="w-5 h-5 stroke-[1.5]" />
          Share Plan to LINE
        </button>
        
        <div className="flex gap-3">
          <button className="flex-1 bg-white border border-neutral-200 text-neutral-800 font-semibold rounded-2xl h-12 flex items-center justify-center gap-2 active:scale-[0.97] transition-all">
            <Bookmark className="w-4 h-4 text-neutral-500 stroke-[1.5]" />
            <span className="text-[14px]">Save Plan</span>
          </button>
          <button className="flex-1 bg-white border border-neutral-200 text-neutral-800 font-semibold rounded-2xl h-12 flex items-center justify-center gap-2 active:scale-[0.97] transition-all">
            <Plus className="w-4 h-4 text-neutral-500 stroke-[1.5]" />
            <span className="text-[14px]">Continue Planning</span>
          </button>
        </div>

        {/* Upgrade Teaser */}
        <div className="mt-4 bg-neutral-50 rounded-2xl p-4 border border-neutral-100 flex items-center justify-between cursor-pointer group hover:bg-neutral-100 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-neutral-700">Unlock the full Toast experience ✨</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors stroke-[1.5]" />
        </div>
      </div>
    </div>
  );
}
