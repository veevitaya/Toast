import React, { useState } from 'react';
import { Share2, Settings2, X, Users, MapPin, Clock, Calendar, Check, ChevronRight } from 'lucide-react';

const LOCATIONS = [
  { id: "bts", label: "Near BTS" },
  { id: "mall", label: "At the mall" },
  { id: "street", label: "Street food" },
  { id: "rooftop", label: "Rooftop" },
  { id: "riverside", label: "Riverside" },
  { id: "latenight", label: "Late night" },
];

const BUDGETS = [
  { id: "1", label: "Cheap eats ฿" },
  { id: "2", label: "Mid range ฿฿" },
  { id: "3", label: "Fancy ฿฿฿" },
  { id: "4", label: "Splurge ฿฿฿฿" },
];

const RESTRICTIONS = [
  { id: "halal", label: "Halal" },
  { id: "vegan", label: "Vegan" },
  { id: "nopork", label: "No Pork" },
];

export default function InviteFirst() {
  const [isEditing, setIsEditing] = useState(false);
  const [when, setWhen] = useState('Today, anytime');
  const [where, setWhere] = useState('Anywhere');
  const [budget, setBudget] = useState('Any budget');
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleInvite = () => {
    setInviteStatus('sending');
    setTimeout(() => {
      setInviteStatus('sent');
    }, 1500);
  };

  const getSummary = () => {
    return `${when} · ${where} · ${budget}`;
  };

  const toggleRestriction = (id: string) => {
    setRestrictions(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#FAF6EF] flex flex-col font-['Inter'] relative text-[#1a1a1a]">
      {/* Main View */}
      <div className="flex-1 flex flex-col pt-[20vh] px-8">
        <div className="flex-1 flex flex-col">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[40px] leading-[1.05] font-medium tracking-tight mb-4 text-[#1a1a1a]">
            Who's coming?
          </h1>
          <p className="text-[17px] text-black/50 leading-relaxed mb-10 font-medium">
            Send a link to your friends. We'll find a place you all want to eat.
          </p>

          <button 
            onClick={handleInvite}
            disabled={inviteStatus !== 'idle'}
            className="w-full bg-[#06C755] text-white rounded-[20px] py-4 text-[17px] font-semibold flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(6,199,85,0.2)] active:scale-[0.98] transition-all disabled:opacity-80 mb-6"
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
          
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full bg-white rounded-[20px] p-4 flex items-center justify-between border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all group hover:border-black/[0.08]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#FAF6EF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFCC02]/20 transition-colors">
                <Settings2 className="w-5 h-5 text-[#1a1a1a]" />
              </div>
              <div className="text-left">
                <div className="text-[15px] font-medium text-[#1a1a1a] line-clamp-1">{getSummary()}</div>
                <div className="text-[13px] font-medium text-black/40 mt-0.5">Tap to adjust defaults</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-black/20 group-hover:text-black/40 transition-colors" />
          </button>
        </div>

        <div className="pb-10 pt-6">
          <button className="w-full text-black/40 text-[15px] font-medium py-4 active:text-black/60 transition-colors">
            Skip for now, just start
          </button>
        </div>
      </div>

      {/* Edit Settings Sheet */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isEditing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsEditing(false)}
      />
      
      <div 
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white rounded-t-3xl z-50 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isEditing ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[22px] font-semibold">Tweak settings</h2>
            <button 
              onClick={() => setIsEditing(false)}
              className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4 text-black/60" />
            </button>
          </div>

          <div className="space-y-8 max-h-[60vh] overflow-y-auto pb-6">
            {/* When */}
            <div>
              <label className="text-[13px] font-semibold text-black/40 uppercase tracking-wider mb-3 block">When</label>
              <div className="flex flex-wrap gap-2">
                {['Today, anytime', 'Tonight', 'Tomorrow', 'This weekend'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setWhen(opt)}
                    className={`px-4 py-2 rounded-full text-[14px] font-medium border transition-colors ${
                      when === opt 
                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                        : 'bg-white text-black/60 border-black/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Where */}
            <div>
              <label className="text-[13px] font-semibold text-black/40 uppercase tracking-wider mb-3 block">Where</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setWhere('Anywhere')}
                  className={`px-4 py-2 rounded-full text-[14px] font-medium border transition-colors ${
                    where === 'Anywhere' 
                      ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                      : 'bg-white text-black/60 border-black/10'
                  }`}
                >
                  Anywhere
                </button>
                {LOCATIONS.map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => setWhere(opt.label)}
                    className={`px-4 py-2 rounded-full text-[14px] font-medium border transition-colors ${
                      where === opt.label 
                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                        : 'bg-white text-black/60 border-black/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="text-[13px] font-semibold text-black/40 uppercase tracking-wider mb-3 block">Budget</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setBudget('Any budget')}
                  className={`px-4 py-2 rounded-full text-[14px] font-medium border transition-colors ${
                    budget === 'Any budget' 
                      ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                      : 'bg-white text-black/60 border-black/10'
                  }`}
                >
                  Any budget
                </button>
                {BUDGETS.map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => setBudget(opt.label)}
                    className={`px-4 py-2 rounded-full text-[14px] font-medium border transition-colors ${
                      budget === opt.label 
                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                        : 'bg-white text-black/60 border-black/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary */}
            <div>
              <label className="text-[13px] font-semibold text-black/40 uppercase tracking-wider mb-3 block">Dietary Restrictions</label>
              <div className="flex flex-wrap gap-2">
                {RESTRICTIONS.map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => toggleRestriction(opt.id)}
                    className={`px-4 py-2 rounded-full text-[14px] font-medium border transition-colors ${
                      restrictions.includes(opt.id) 
                        ? 'bg-[#FFCC02] text-[#1a1a1a] border-[#FFCC02]' 
                        : 'bg-white text-black/60 border-black/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-black/5">
            <button 
              onClick={() => setIsEditing(false)}
              className="w-full bg-[#1a1a1a] text-white rounded-full py-4 text-[17px] font-semibold active:scale-[0.98] transition-transform"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}