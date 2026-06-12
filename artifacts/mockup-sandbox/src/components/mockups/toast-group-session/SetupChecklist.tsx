import { useState } from 'react';
import { Check, Share2, Sparkles, MapPin, ChevronRight, Play } from 'lucide-react';

export default function SetupChecklist() {
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);

  const allDone = step1Done && step2Done;

  return (
    <div className="max-w-[430px] mx-auto min-h-[100dvh] bg-[#FAF6EF] relative shadow-2xl overflow-hidden font-['Inter'] flex flex-col text-[#1A1A1A]">
      <header className="pt-16 pb-6 px-8 relative z-10">
        <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold tracking-tight mb-2">
          Let's get started
        </h1>
        <p className="text-[16px] text-[#9A938A] leading-relaxed">
          Complete these quick steps to start matching with your friends.
        </p>

        {/* Progress bar */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-black/[0.06]">
            <div 
              className="h-full bg-[#FFCC02] transition-all duration-500" 
              style={{ width: allDone ? '100%' : step1Done ? '50%' : '0%' }}
            />
          </div>
          <span className="text-[13px] font-bold text-[#9A938A]">
            {allDone ? '2/2' : step1Done ? '1/2' : '0/2'}
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 pb-32">
        <div className="space-y-4">
          
          {/* Step 1 */}
          <div 
            className={`bg-white rounded-[24px] border ${step1Done ? 'border-[#06C755]/30 shadow-none' : 'border-black/[0.06] shadow-[0_6px_20px_-10px_rgba(0,0,0,0.10)]'} p-5 transition-all duration-300 relative overflow-hidden`}
          >
            {step1Done && <div className="absolute inset-0 bg-[#06C755]/5 pointer-events-none" />}
            
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${step1Done ? 'bg-[#06C755] text-white' : 'bg-[#FAF6EF] text-[#9A938A] font-bold'}`}>
                {step1Done ? <Check className="w-5 h-5" /> : '1'}
              </div>
              
              <div className="flex-1">
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[17px] mb-1">Set the vibe</h3>
                <p className="text-[14px] text-[#9A938A] mb-4">Where and when are we eating?</p>
                
                {step1Done ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-black/[0.06]" onClick={() => setStep1Done(false)}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#1A1A1A]" />
                      <span className="text-[14px] font-medium">Near BTS · Today</span>
                    </div>
                    <span className="text-[13px] font-medium text-[#06C755]">Edit</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setStep1Done(true)}
                    className="w-full py-3 bg-[#1A1A1A] text-white rounded-xl text-[15px] font-medium active:scale-[0.98] transition-transform"
                  >
                    Set details
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div 
            className={`bg-white rounded-[24px] border ${step2Done ? 'border-[#06C755]/30 shadow-none' : 'border-black/[0.06] shadow-[0_6px_20px_-10px_rgba(0,0,0,0.10)]'} p-5 transition-all duration-300 relative overflow-hidden ${!step1Done ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {step2Done && <div className="absolute inset-0 bg-[#06C755]/5 pointer-events-none" />}
            
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${step2Done ? 'bg-[#06C755] text-white' : 'bg-[#FAF6EF] text-[#9A938A] font-bold'}`}>
                {step2Done ? <Check className="w-5 h-5" /> : '2'}
              </div>
              
              <div className="flex-1">
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[17px] mb-1">Invite friends</h3>
                <p className="text-[14px] text-[#9A938A] mb-4">Get the squad in here.</p>
                
                {step2Done ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-black/[0.06]">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#1A1A1A]" />
                      <span className="text-[14px] font-medium">Invites sent</span>
                    </div>
                    <span className="text-[13px] font-medium text-[#06C755]">Sent</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setStep2Done(true)}
                    className="w-full py-3 bg-[#06C755] text-white rounded-xl text-[15px] font-medium active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Invite via LINE
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Ready State */}
        {allDone && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFCC02]/20 mb-4">
              <Sparkles className="w-8 h-8 text-[#D4A000]" />
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold mb-2">You're all set!</h2>
            <p className="text-[15px] text-[#9A938A]">Everyone is ready to find food.</p>
          </div>
        )}
      </main>

      {/* Start Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAF6EF] via-[#FAF6EF] to-transparent pt-12">
        <button
          className={`w-full py-4 rounded-2xl font-['Plus_Jakarta_Sans'] font-bold text-[18px] flex items-center justify-center gap-2 transition-all duration-300 ${
            allDone 
              ? "bg-[#FFCC02] text-[#1A1A1A] shadow-[0_8px_24px_rgba(255,204,2,0.3)] active:scale-[0.98] translate-y-0 opacity-100" 
              : "translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <Play className="w-5 h-5 fill-current" />
          Start swiping
        </button>
      </footer>
    </div>
  );
}
