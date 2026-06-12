import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function InviteWarmWelcome() {
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleInvite = () => {
    setInviteStatus('sending');
    setTimeout(() => {
      setInviteStatus('sent');
    }, 1500);
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-[100dvh] bg-[#FAF6EF] flex flex-col font-['Inter'] relative text-[#1A1A1A] overflow-hidden">
      
      {/* Warm background gradient */}
      <div className="absolute top-0 inset-x-0 h-[60vh] bg-gradient-to-b from-[#FFCC02]/20 via-[#FFCC02]/5 to-transparent pointer-events-none" />
      
      {/* Decorative blurred shapes */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FFCC02]/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-40 -left-20 w-48 h-48 bg-orange-300/20 rounded-full blur-[60px] pointer-events-none" />

      <div className="flex-1 flex flex-col px-8 relative z-10">
        
        <div className="flex-1 flex flex-col justify-center mb-10">
          <div className="w-16 h-16 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-center mb-8 border border-black/[0.04] rotate-[-6deg]">
            <span className="text-3xl">🥂</span>
          </div>

          <h1 className="font-['Plus_Jakarta_Sans'] text-[42px] leading-[1.05] font-bold tracking-[-0.03em] mb-5 text-[#1A1A1A]">
            Good food is better shared.
          </h1>
          
          <p className="text-[18px] text-black/60 leading-relaxed font-medium max-w-[280px]">
            Invite friends to your table, and we'll help you all decide where to eat tonight.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-5 pb-12">
          
          <button 
            onClick={handleInvite}
            disabled={inviteStatus !== 'idle'}
            className="w-full bg-[#06C755] text-white rounded-[20px] py-[18px] text-[17px] font-semibold flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(6,199,85,0.25)] active:scale-[0.98] transition-all disabled:opacity-80"
          >
            {inviteStatus === 'idle' && (
              <>
                <Share2 className="w-5 h-5" />
                Invite via LINE
              </>
            )}
            {inviteStatus === 'sending' && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {inviteStatus === 'sent' && (
              <>
                <Check className="w-5 h-5" />
                Invited!
              </>
            )}
          </button>

          <button className="w-full text-black/40 text-[16px] font-medium py-3 active:text-black/60 transition-colors">
            I'm eating solo
          </button>
          
        </div>
      </div>
    </div>
  );
}
