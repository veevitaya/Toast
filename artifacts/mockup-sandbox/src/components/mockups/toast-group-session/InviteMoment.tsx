import { useState } from 'react';
import { Share2, Check, ArrowRight, Settings2, Users } from 'lucide-react';

export default function InviteMoment() {
  const [inviteSent, setInviteSent] = useState(false);

  return (
    <div className="max-w-[430px] mx-auto min-h-[100dvh] bg-[#1A1A1A] relative shadow-2xl overflow-hidden font-['Inter'] flex flex-col text-white">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FFCC02] opacity-[0.15] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-[#06C755] opacity-[0.1] rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="pt-12 pb-4 px-6 flex items-center justify-between z-10 relative">
        <button className="text-[15px] font-medium text-white/60 hover:text-white transition-colors">
          Cancel
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 active:scale-95 transition-transform">
          <Settings2 className="w-5 h-5 text-white" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 z-10 relative pb-20">
        
        <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#FFCC02] to-[#D4A000] p-[2px] mb-8 shadow-[0_0_40px_rgba(255,204,2,0.3)] animate-in zoom-in duration-700">
          <div className="w-full h-full bg-[#1A1A1A] rounded-[22px] flex items-center justify-center text-[32px]">
            🍜
          </div>
        </div>

        <h2 className="text-[16px] font-medium text-[#FFCC02] mb-3 uppercase tracking-[0.1em]">
          Session Created
        </h2>
        
        <div className="text-center mb-10">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[56px] font-bold leading-none tracking-tight mb-4">
            4892
          </h1>
          <p className="text-[16px] text-white/70 leading-relaxed max-w-[260px] mx-auto">
            Your group session is ready. Send the link so friends can join the lobby.
          </p>
        </div>

        {/* Action Card */}
        <div className="w-full bg-white/10 backdrop-blur-xl rounded-[24px] border border-white/10 p-4">
          <button 
            onClick={() => setInviteSent(true)}
            className={`w-full py-4 rounded-[16px] flex items-center justify-center gap-2 font-semibold text-[17px] transition-all duration-300 ${
              inviteSent 
                ? "bg-white/10 text-white" 
                : "bg-[#06C755] text-white shadow-[0_0_20px_rgba(6,199,85,0.4)] active:scale-[0.98]"
            }`}
          >
            {inviteSent ? (
              <>
                <Check className="w-5 h-5" />
                Invite Sent
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Invite via LINE
              </>
            )}
          </button>

          <button className="w-full mt-3 py-3 rounded-[16px] font-medium text-[15px] text-white/70 hover:text-white hover:bg-white/5 transition-all">
            Copy Session Link
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <button className="w-full py-4 rounded-[16px] bg-white text-[#1A1A1A] font-['Plus_Jakarta_Sans'] font-bold text-[17px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          Go to Lobby
          <ArrowRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
