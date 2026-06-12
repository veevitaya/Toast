import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Share2, Users, Check, ChevronRight, Clock, Sparkles } from 'lucide-react';

export default function TwoStepLite() {
  const [step, setStep] = useState(2); // Start at step 2 per requirements
  const [inviteSent, setInviteSent] = useState(false);
  
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>("Today");

  const LOCATIONS = [
    { id: "bts", label: "Near BTS" },
    { id: "mall", label: "At the mall" },
    { id: "street", label: "Street food" },
    { id: "rooftop", label: "Rooftop" },
    { id: "riverside", label: "Riverside" },
    { id: "latenight", label: "Late night" },
  ];

  return (
    <div className="max-w-[430px] mx-auto min-h-[100dvh] bg-[#FAF6EF] relative shadow-2xl overflow-hidden font-['Inter'] flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-4 px-6 flex items-center justify-between z-10 relative">
        <button 
          onClick={() => step === 2 ? setStep(1) : null}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-800" />
        </button>
        
        <div className="flex gap-1.5 items-center">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-6 bg-zinc-800' : 'w-1.5 bg-zinc-300'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-6 bg-zinc-800' : 'w-1.5 bg-zinc-300'}`} />
        </div>
        
        <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      {/* Content */}
      <main className="flex-1 px-6 pb-32 overflow-y-auto">
        <div className="transition-all duration-500 transform relative h-full">
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both">
              <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-semibold text-zinc-900 leading-tight mb-2 tracking-tight">
                The basics
              </h1>
              <p className="text-[15px] text-zinc-500 mb-8 leading-relaxed">
                Where and when are we eating?
              </p>

              <div className="space-y-6">
                {/* Date */}
                <div className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-zinc-700" />
                    </div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-zinc-900">When?</h3>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {["Today", "Tomorrow", "Later"].map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-1 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                          selectedDate === date
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                  {selectedDate === "Today" && (
                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100 mt-2 cursor-pointer active:scale-[0.98] transition-transform">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-zinc-400" />
                        <span className="text-[14px] text-zinc-700">Anytime</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-zinc-700" />
                    </div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-zinc-900">Where?</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className={`px-4 py-2 rounded-full border text-[14px] font-medium transition-all ${
                        selectedLocation === null
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      Anywhere
                    </button>
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => setSelectedLocation(loc.id)}
                        className={`px-4 py-2 rounded-full border text-[14px] font-medium transition-all ${
                          selectedLocation === loc.id
                            ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                        }`}
                      >
                        {loc.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both">
              <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-semibold text-zinc-900 leading-tight mb-2 tracking-tight">
                Invite your people
              </h1>
              <p className="text-[15px] text-zinc-500 mb-8 leading-relaxed">
                Send a quick link to start swiping together.
              </p>

              <div className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-zinc-900 mb-1 text-[17px]">Session #4892</h3>
                    <p className="text-[14px] text-zinc-500">
                      {selectedDate || "Today"}, {selectedLocation ? LOCATIONS.find(l => l.id === selectedLocation)?.label : "Anywhere"}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#FFCC02]/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#D4A000]" />
                  </div>
                </div>

                <div className="bg-[#FAF6EF] rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-200 border-2 border-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <span className="text-[18px]">🐻</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-zinc-900">You are hosting</p>
                      <p className="text-[13px] text-zinc-500 mt-0.5">Waiting for friends to join...</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setInviteSent(true)}
                  className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                    inviteSent 
                      ? "bg-zinc-100 text-zinc-500 cursor-default" 
                      : "bg-[#06C755] text-white hover:bg-[#05b34c] shadow-[0_4px_16px_rgba(6,199,85,0.25)] active:scale-[0.98]"
                  }`}
                >
                  {inviteSent ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span className="text-[16px]">Sent via LINE</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      <span className="text-[16px]">Invite via LINE</span>
                    </>
                  )}
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-[14px] text-zinc-500">
                  <span>or</span>
                  <button className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-600 transition-colors">
                    copy link
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)] opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center">
                    <Users className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-zinc-900">Who's joined?</h3>
                    <p className="text-[13px] text-zinc-400 mt-0.5">0 friends so far</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAF6EF] via-[#FAF6EF] to-transparent pt-12 pb-8">
        <button
          onClick={() => step === 1 ? setStep(2) : null}
          className="w-full bg-[#FFCC02] text-zinc-900 py-4 rounded-xl font-['Plus_Jakarta_Sans'] font-semibold text-[17px] shadow-[0_4px_16px_rgba(255,204,2,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          {step === 1 ? "Next: Invite" : "Start session"}
        </button>
      </footer>
    </div>
  );
}
