import { useState, useEffect } from 'react';
import { Share2, Users, MapPin, Sparkles, Check, Settings2, Clock } from 'lucide-react';

export default function LobbySingle() {
  const [inviteSent, setInviteSent] = useState(false);
  const [friendsJoined, setFriendsJoined] = useState(0);

  // Simulate a friend joining after a few seconds
  useEffect(() => {
    if (inviteSent && friendsJoined === 0) {
      const timer = setTimeout(() => setFriendsJoined(1), 2500);
      return () => clearTimeout(timer);
    }
  }, [inviteSent, friendsJoined]);

  const handleInvite = () => {
    setInviteSent(true);
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-[100dvh] bg-[#FAF6EF] relative shadow-2xl overflow-hidden font-['Inter'] flex flex-col text-[#1A1A1A]">
      {/* Header */}
      <header className="pt-12 pb-4 px-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FFCC02]/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#D4A000]" />
          </div>
          <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[15px]">Toast Session</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform">
          <Settings2 className="w-5 h-5 text-[#1A1A1A]" />
        </button>
      </header>

      <main className="flex-1 px-6 pb-32 overflow-y-auto">
        <div className="text-center mt-6 mb-8">
          <p className="text-[14px] text-[#9A938A] font-medium mb-1 uppercase tracking-wider">Session Code</p>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[42px] font-bold tracking-tight">4892</h1>
        </div>

        {/* Session Details */}
        <div className="bg-white rounded-[20px] p-5 border border-black/[0.06] shadow-[0_6px_20px_-10px_rgba(0,0,0,0.10)] mb-6 flex divide-x divide-black/[0.06]">
          <div className="flex-1 flex flex-col items-center justify-center gap-1">
            <MapPin className="w-5 h-5 text-[#9A938A]" />
            <span className="text-[14px] font-medium">Near BTS</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-1">
            <Clock className="w-5 h-5 text-[#9A938A]" />
            <span className="text-[14px] font-medium">Today</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-1">
            <span className="text-[15px] font-medium text-[#9A938A]">฿฿</span>
            <span className="text-[14px] font-medium">Budget</span>
          </div>
        </div>

        {/* The Lobby */}
        <div className="bg-white rounded-[20px] p-6 border border-black/[0.06] shadow-[0_6px_20px_-10px_rgba(0,0,0,0.10)] mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px]">The Lobby</h3>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FAF6EF] rounded-full">
              <Users className="w-4 h-4 text-[#9A938A]" />
              <span className="text-[13px] font-medium text-[#9A938A]">{friendsJoined + 1} inside</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Host */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFCC02] flex items-center justify-center text-[20px] shadow-sm">
                🐻
              </div>
              <div className="flex-1">
                <p className="font-medium text-[15px]">You</p>
                <p className="text-[13px] text-[#9A938A]">Host</p>
              </div>
            </div>

            {/* Joined Friend */}
            {friendsJoined > 0 && (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="w-12 h-12 rounded-full bg-[#FAF6EF] border-2 border-white flex items-center justify-center text-[20px] shadow-sm">
                  🦊
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[15px]">Friend</p>
                  <p className="text-[13px] text-[#06C755] font-medium">Ready to swipe</p>
                </div>
              </div>
            )}

            {/* Waiting Slots */}
            <div className="flex items-center gap-4 opacity-50">
              <div className="w-12 h-12 rounded-full bg-[#FAF6EF] border-2 border-dashed border-[#9A938A]/30 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[15px] text-[#9A938A]">Waiting...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invite Action */}
        <button 
          onClick={handleInvite}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
            inviteSent 
              ? "bg-[#FAF6EF] text-[#9A938A] border border-black/[0.06]" 
              : "bg-[#06C755] text-white shadow-[0_4px_16px_rgba(6,199,85,0.25)] active:scale-[0.98]"
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
        <div className="mt-4 text-center">
          <button className="text-[14px] font-medium text-[#1A1A1A] underline underline-offset-2 hover:text-[#9A938A] transition-colors">
            Copy link instead
          </button>
        </div>
      </main>

      {/* Start Session CTA */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAF6EF] via-[#FAF6EF] to-transparent pt-12">
        <button
          className={`w-full py-4 rounded-xl font-['Plus_Jakarta_Sans'] font-semibold text-[17px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${
            friendsJoined > 0 
              ? "bg-[#1A1A1A] text-white shadow-[0_4px_16px_rgba(26,26,26,0.25)]" 
              : "bg-[#1A1A1A]/10 text-[#1A1A1A]/40 cursor-not-allowed"
          }`}
        >
          {friendsJoined > 0 ? "Start swiping" : "Waiting for friends..."}
        </button>
      </footer>
    </div>
  );
}
