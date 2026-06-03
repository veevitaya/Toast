import { motion } from 'framer-motion';
import { ArrowLeft, Star, Navigation, ArrowRight } from 'lucide-react';
import './_group.css';

const spring = { type: 'spring' as const, stiffness: 260, damping: 26 };

const A = { name: 'Pad Kra Pao', type: 'Thai · Street', rating: '4.7', walk: '4 min', price: '฿฿', img: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=300&q=70' };
const B = { name: 'Khao Soi', type: 'Thai · Noodles', rating: '4.6', walk: '9 min', price: '฿', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&q=70' };

function Pin({ x, y, label, time, tone }: { x: string; y: string; label: string; time: string; tone: string }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center" style={{ left: x, top: y }}>
      <div className="px-2 py-0.5 rounded-full bg-white shadow text-[10px] font-extrabold text-neutral-800 mb-1 whitespace-nowrap">{time}</div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-extrabold text-neutral-900 shadow-[0_4px_10px_rgba(0,0,0,0.2)]" style={{ background: tone }}>{label}</div>
    </div>
  );
}

function MiniCard({ d, label }: { d: typeof A; label: string }) {
  return (
    <div className="flex-1 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-2.5 flex gap-2.5 items-center" data-testid={`mapcard-${label}`}>
      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
        <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
        <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-extrabold text-white bg-black/40">{label}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-extrabold text-neutral-900 leading-tight truncate">{d.name}</p>
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-semibold mt-0.5">
          <span className="flex items-center gap-0.5"><Star size={9} className="text-amber-500 fill-amber-500" />{d.rating}</span>
          <span>·</span><span className="flex items-center gap-0.5"><Navigation size={9} />{d.walk}</span>
          <span>·</span><span>{d.price}</span>
        </div>
      </div>
    </div>
  );
}

export default function TwoOnTheMap() {
  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="quiz-map">
      <div className="h-[44px]" />
      <div className="px-5 pt-2">
        <button className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <ArrowLeft size={18} className="text-neutral-800" />
        </button>
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#C79200] mt-5">Comforting & easy · kept</p>
        <h1 className="text-[27px] font-extrabold text-neutral-900 leading-tight mt-1.5">Which way tonight?</h1>
        <p className="text-[14px] text-neutral-500 mt-1.5">Two great spots near you — pick a direction.</p>
      </div>

      {/* faux map */}
      <div className="px-5 mt-5 flex-1">
        <div className="relative w-full h-full rounded-3xl overflow-hidden border border-black/[0.06]" style={{ background: 'linear-gradient(135deg,#EAF3EC,#F3F0E6)' }} data-testid="map-canvas">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path d="M0,160 Q150,120 400,200" stroke="#fff" strokeWidth="10" fill="none" opacity="0.9" />
            <path d="M70,0 L130,400" stroke="#fff" strokeWidth="8" fill="none" opacity="0.8" />
            <path d="M260,0 L240,400" stroke="#fff" strokeWidth="8" fill="none" opacity="0.8" />
            <path d="M0,300 Q200,280 400,330" stroke="#fff" strokeWidth="7" fill="none" opacity="0.7" />
            <line x1="50%" y1="50%" x2="22%" y2="28%" stroke="#FFCC02" strokeWidth="2.5" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="76%" y2="62%" stroke="#C79200" strokeWidth="2.5" strokeDasharray="4 4" />
          </svg>
          {/* you */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" />
            <span className="text-[9px] font-bold text-neutral-500 mt-0.5">You</span>
          </div>
          <Pin x="22%" y="28%" label="A" time="4 min" tone="#FFCC02" />
          <Pin x="76%" y="62%" label="B" time="9 min" tone="#FFE38A" />
        </div>
      </div>

      {/* cards + cta */}
      <div className="px-5 mt-4 flex gap-2.5">
        <MiniCard d={A} label="A" />
        <MiniCard d={B} label="B" />
      </div>
      <div className="px-5 pb-8 pt-3">
        <button className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-extrabold text-[16px] bg-[#FFCC02] text-[#2d2000]"
          style={{ boxShadow: '0 8px 24px -6px rgba(255,204,2,0.5)' }} data-testid="button-compare">
          Compare both
          <ArrowRight size={19} />
        </button>
      </div>
    </div>
  );
}
