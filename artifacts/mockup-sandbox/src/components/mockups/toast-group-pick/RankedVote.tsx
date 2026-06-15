import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, GripVertical, Crown } from 'lucide-react';

export function RankedVote() {
  const voters = [
    { id: 'you', name: 'You', avatar: '👩🏻', status: 'voted' },
    { id: 'mint', name: 'Mint', avatar: '👩🏽', status: 'voted' },
    { id: 'ploy', name: 'Ploy', avatar: '👱🏻‍♀️', status: 'voted' },
    { id: 'beam', name: 'Beam', avatar: '👨🏻', status: 'deciding' },
  ];

  const options = [
    {
      id: 'hom-duan',
      restaurant: 'Hom Duan',
      dish: 'Khao Soi',
      emoji: '🍜',
      votes: 3,
      voters: ['👩🏻', '👩🏽', '👱🏻‍♀️'],
      isLeading: true,
      price: '฿฿',
      rating: 4.8
    },
    {
      id: 'baan-phadthai',
      restaurant: 'Baan Phadthai',
      dish: 'Pad Thai',
      emoji: '🍤',
      votes: 2,
      voters: ['👩🏽', '👨🏻'],
      isLeading: false,
      price: '฿฿',
      rating: 4.6
    },
    {
      id: 'roast',
      restaurant: 'Roast',
      dish: 'Brunch',
      emoji: '🥞',
      votes: 1,
      voters: ['👩🏻'],
      isLeading: false,
      price: '฿฿฿',
      rating: 4.5
    },
    {
      id: 'err',
      restaurant: 'Err',
      dish: 'Som Tam',
      emoji: '🥗',
      votes: 0,
      voters: [],
      isLeading: false,
      price: '฿฿',
      rating: 4.4
    }
  ];

  return (
    <div 
      className="relative mx-auto overflow-hidden bg-[#FAF6EF] text-[#0F172A] flex flex-col"
      style={{ width: 390, minHeight: 844, fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      {/* Top Navigation / Header */}
      <header className="px-6 pt-14 pb-4">
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full px-3 py-1 text-xs font-semibold tracking-wide border" style={{ borderColor: 'rgba(16,24,40,.06)', color: '#6B7280' }}>
            TIEBREAKER
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-center tracking-tight mb-2">
          Rank your favorites
        </h1>
        <p className="text-center text-[#6B7280] text-sm font-medium">
          Drag to order. First to 4 points wins!
        </p>
      </header>

      {/* Active Voters Status */}
      <section className="px-6 mb-6">
        <div className="flex items-center justify-between bg-white rounded-[20px] p-4" style={{ boxShadow: '0 1px 2px rgba(16,24,40,.05), 0 10px 30px rgba(16,24,40,.08)', border: '1px solid rgba(16,24,40,.06)' }}>
          <div className="flex -space-x-2">
            {voters.map((voter) => (
              <div 
                key={voter.id}
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 border-white relative"
                style={{ 
                  backgroundColor: voter.status === 'voted' ? '#FAF6EF' : '#F3F4F6',
                  opacity: voter.status === 'voted' ? 1 : 0.5,
                  zIndex: voter.status === 'voted' ? 10 : 1
                }}
              >
                {voter.avatar}
                {voter.status === 'voted' && (
                  <div className="absolute -bottom-1 -right-1 bg-[#10B981] w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-right">
            <div className="text-sm font-bold">3 of 4 voted</div>
            <div className="text-xs text-[#6B7280]">waiting on Beam...</div>
          </div>
        </div>
      </section>

      {/* Voting List */}
      <section className="px-6 flex-1 pb-32">
        <div className="space-y-4">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white rounded-[24px] p-4 flex items-center gap-4 transition-transform active:scale-[0.98]"
              style={{ 
                boxShadow: option.isLeading 
                  ? '0 0 0 2px #FFCC02, 0 10px 30px rgba(255,204,2,.15)' 
                  : '0 1px 2px rgba(16,24,40,.05), 0 10px 30px rgba(16,24,40,.08)',
                border: option.isLeading ? 'none' : '1px solid rgba(16,24,40,.06)',
                zIndex: 4 - index
              }}
            >
              {/* Rank Number / Icon */}
              <div className="flex flex-col items-center justify-center w-6 h-full gap-2">
                <GripVertical className="text-[#6B7280] opacity-30 w-5 h-5" />
                <span className="text-sm font-bold text-[#6B7280]">#{index + 1}</span>
              </div>

              {/* Emoji Icon */}
              <div className="w-14 h-14 rounded-[16px] bg-[#FAF6EF] flex items-center justify-center text-3xl shrink-0 relative">
                {option.emoji}
                {option.isLeading && (
                  <div className="absolute -top-2 -right-2 bg-[#FFCC02] rounded-full p-1 shadow-sm">
                    <Crown className="w-3.5 h-3.5 text-[#0F172A]" strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-bold text-[17px] truncate pr-2">{option.restaurant}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-bold text-lg">{option.votes}</span>
                    <span className="text-[11px] text-[#6B7280] font-semibold uppercase tracking-wider">pts</span>
                  </div>
                </div>
                <div className="text-sm text-[#6B7280] truncate mb-2">{option.dish} · {option.rating} ★</div>
                
                {/* Voters who chose this */}
                <div className="flex items-center gap-1.5 h-6">
                  {option.voters.map((avatar, i) => (
                    <div key={i} className="text-sm bg-[#FAF6EF] w-6 h-6 rounded-full flex items-center justify-center">
                      {avatar}
                    </div>
                  ))}
                  {option.voters.length === 0 && (
                    <span className="text-xs text-[#6B7280] italic">No votes yet</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Fixed Bottom Action */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-6 pt-8 bg-gradient-to-t from-[#FAF6EF] via-[#FAF6EF] to-transparent"
        style={{ zIndex: 50 }}
      >
        <button 
          className="w-full bg-[#FFCC02] text-[#0F172A] rounded-full py-4 px-6 font-bold text-[17px] flex items-center justify-center gap-2"
          style={{ boxShadow: '0 8px 25px -5px rgba(255,204,2,0.4)' }}
        >
          <span>End Voting Early</span>
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>
        <div className="text-center mt-4">
          <span className="text-xs font-semibold text-[#6B7280]">
            Or wait for Beam to finish (0:45)
          </span>
        </div>
      </div>
    </div>
  );
}
