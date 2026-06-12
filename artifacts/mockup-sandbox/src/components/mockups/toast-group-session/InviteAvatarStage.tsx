import { useState, useEffect } from 'react';
import { Share2, User, ChevronRight, Settings2, Check, UserPlus } from 'lucide-react';

export default function InviteAvatarStage() {
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleInvite = () => {
    setInviteStatus('sending');
    setTimeout(() => {
      setInviteStatus('sent');
    }, 1500);
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-[100dvh] bg-[#FAF6EF] flex flex-col font-['Inter'] relative text-[#1A1A1A] overflow-hidden">
      
      {/* Top decoration */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/[0.03] to-transparent pointer-events-none" />

      <div className="flex-1 flex flex-col pt-16 px-6">
        
        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] leading-tight font-semibold tracking-[-0.02em] mb-3 text-[#1A1A1A]">
            Your table is ready
          </h1>
          <p className="text-[16px] text-black/50 leading-relaxed font-medium">
            Who are we waiting for? Invite them to start deciding together.
          </p>
        </div>

        {/* Avatar Stage */}
        <div className="flex justify-center items-center gap-4 mb-16 relative">
          {/* Host */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white text-xl font-medium shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-10 relative">
              You
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-black/5">
              Host
            </div>
          </div>

          {/* Empty slot 1 */}
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-black/15 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[#FFCC02]/20 rounded-full animate-pulse" />
            <UserPlus className="w-5 h-5 text-black/30" />
          </div>

          {/* Empty slot 2 */}
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-black/15 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[#FFCC02]/10 rounded-full animate-pulse delay-150" />
            <User className="w-5 h-5 text-black/20" />
          </div>

          {/* Empty slot 3 */}
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-black/10 flex items-center justify-center">
            <User className="w-5 h-5 text-black/10" />
          </div>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex flex-col gap-4 relative z-10">
          
          <button 
            className="w-full bg-white rounded-2xl p-4 flex items-center justify-between border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF6EF] flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-[#1A1A1A]/70" />
              </div>
              <div className="text-left">
                <div className="text-[14px] font-medium text-[#1A1A1A]">Today · Anywhere · Any budget</div>
                <div className="text-[12px] font-medium text-black/40 mt-0.5">Tap to adjust defaults</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-black/20" />
          </button>

          <button 
            onClick={handleInvite}
            disabled={inviteStatus !== 'idle'}
            className="w-full bg-[#06C755] text-white rounded-[20px] py-4 text-[17px] font-semibold flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(6,199,85,0.2)] active:scale-[0.98] transition-all disabled:opacity-80"
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

          <button className="w-full text-black/40 text-[15px] font-medium py-3 active:text-black/60 transition-colors">
            Skip for now, just start
          </button>
        </div>
        
        <div className="h-6" />
      </div>
    </div>
  );
}
