import { useState } from 'react';
import { Share2, Settings2, ChevronRight, Check } from 'lucide-react';

const CONTACTS = [
  { id: '1', name: 'Ploy', initial: 'P', color: 'bg-rose-100 text-rose-700' },
  { id: '2', name: 'Krit', initial: 'K', color: 'bg-blue-100 text-blue-700' },
  { id: '3', name: 'Sarah', initial: 'S', color: 'bg-emerald-100 text-emerald-700' },
  { id: '4', name: 'Win', initial: 'W', color: 'bg-amber-100 text-amber-700' },
  { id: '5', name: 'Mint', initial: 'M', color: 'bg-purple-100 text-purple-700' },
];

export default function InviteContactsPick() {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const toggleContact = (id: string) => {
    setSelectedContacts(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleInvite = () => {
    if (selectedContacts.length === 0) return;
    setInviteStatus('sending');
    setTimeout(() => {
      setInviteStatus('sent');
      setTimeout(() => setInviteStatus('idle'), 2000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-[100dvh] bg-[#FAF6EF] flex flex-col font-['Inter'] relative text-[#1A1A1A]">
      <div className="flex-1 flex flex-col pt-16 px-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[36px] leading-tight font-semibold tracking-[-0.02em] mb-3">
            Who's coming?
          </h1>
          <p className="text-[16px] text-black/50 leading-relaxed font-medium">
            Select friends to invite directly, or share a link.
          </p>
        </div>

        {/* Contacts Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-semibold text-black/40 uppercase tracking-wider">Suggested</span>
            {selectedContacts.length > 0 && (
              <span className="text-[13px] font-bold text-[#1A1A1A] bg-[#FFCC02] px-2 py-0.5 rounded-full">
                {selectedContacts.length} selected
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {CONTACTS.map(contact => {
              const isSelected = selectedContacts.includes(contact.id);
              return (
                <button
                  key={contact.id}
                  onClick={() => toggleContact(contact.id)}
                  className="flex flex-col items-center gap-2 relative group"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium transition-all ${contact.color} ${isSelected ? 'ring-2 ring-offset-2 ring-offset-[#FAF6EF] ring-[#1A1A1A] scale-95' : 'ring-1 ring-black/5 hover:scale-[1.02]'}`}>
                    {contact.initial}
                  </div>
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-5 h-5 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center border-2 border-[#FAF6EF]">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                  )}
                  <span className={`text-[13px] ${isSelected ? 'font-semibold text-[#1A1A1A]' : 'font-medium text-black/60'}`}>
                    {contact.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="h-[1px] flex-1 bg-black/5" />
          <span className="text-[13px] font-medium text-black/30">or</span>
          <div className="h-[1px] flex-1 bg-black/5" />
        </div>

        <button className="w-full bg-white rounded-[16px] py-4 text-[15px] font-medium flex items-center justify-center gap-2 border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-transform text-[#06C755]">
          <Share2 className="w-4 h-4" />
          Share invite link via LINE
        </button>

        <div className="flex-1" />

        {/* Defaults & Actions */}
        <div className="flex flex-col gap-4 mt-8 pb-6">
          <div className="flex items-center justify-between px-4 py-3 bg-white rounded-[16px] border border-black/[0.06]">
            <div className="flex items-center gap-3 text-[14px]">
              <Settings2 className="w-4 h-4 text-black/40" />
              <span className="font-medium text-black/60">Anywhere · Any budget</span>
            </div>
            <button className="text-[13px] font-semibold text-[#1A1A1A]">Edit</button>
          </div>

          <button 
            onClick={handleInvite}
            disabled={inviteStatus !== 'idle'}
            className={`w-full rounded-[20px] py-4 text-[17px] font-semibold flex items-center justify-center gap-2 shadow-[0_6px_20px_-10px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-all
              ${selectedContacts.length > 0 
                ? 'bg-[#1A1A1A] text-white' 
                : 'bg-black/5 text-black/30'}`}
          >
            {inviteStatus === 'idle' && (
              selectedContacts.length > 0 ? 'Send Invites' : 'Select friends to start'
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
        </div>

      </div>
    </div>
  );
}
