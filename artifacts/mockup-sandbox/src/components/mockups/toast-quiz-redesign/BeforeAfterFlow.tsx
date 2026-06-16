import { ArrowDown, X, Check, SlidersHorizontal } from 'lucide-react';
import './_group.css';

function Node({
  emoji, title, sub, tone = 'plain',
}: { emoji: string; title: string; sub?: string; tone?: 'plain' | 'gold' | 'bad' }) {
  const styles =
    tone === 'gold'
      ? { backgroundColor: '#FFF6DA', border: '1px solid rgba(255,204,2,0.6)' }
      : tone === 'bad'
      ? { backgroundColor: '#FFF1F0', border: '1px solid rgba(220,80,70,0.35)' }
      : { backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' };
  return (
    <div className="rounded-2xl px-3.5 py-3 flex items-center gap-3 shadow-[0_4px_14px_-10px_rgba(0,0,0,0.25)]" style={styles}>
      <span className="text-[22px] leading-none">{emoji}</span>
      <div className="min-w-0">
        <p className="text-[13.5px] font-extrabold text-neutral-900 leading-tight">{title}</p>
        {sub && <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-1">
      <ArrowDown size={16} className="text-neutral-300" />
    </div>
  );
}

export default function BeforeAfterFlow() {
  return (
    <div className="toast-quiz w-[390px] h-[844px] overflow-hidden relative flex flex-col" style={{ backgroundColor: '#FCFCFC' }} data-testid="before-after-flow">
      <div className="h-[44px]" />

      <div className="px-5 pt-2">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#C79200]">Solo journey · flow change</p>
        <h1 className="text-[22px] font-extrabold text-neutral-900 leading-tight mt-0.5">Cut the extra quiz step</h1>
        <p className="text-[12.5px] text-neutral-500 mt-1.5 leading-snug">After “What sounds good?”, Compare jumps straight to the two picks — preferences move onto that screen.</p>
      </div>

      <div className="flex-1 px-4 mt-4 flex gap-3">
        {/* BEFORE */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2 px-0.5">
            <span className="w-5 h-5 rounded-full bg-[#FFF1F0] flex items-center justify-center"><X size={12} className="text-[#d2544a]" /></span>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#c1564d]">Before</p>
          </div>
          <Node emoji="😋" title="What sounds good?" sub="Pick a mood" />
          <Arrow />
          <Node emoji="📝" title="Quiz screen" sub="Re-asks craving, scene & budget" tone="bad" />
          <div className="px-1 py-0.5">
            <p className="text-[10px] font-bold text-[#c1564d] text-center">↑ redundant — already picked</p>
          </div>
          <Arrow />
          <Node emoji="⚖️" title="Compare options" sub="Finally see 2 picks" />
        </div>

        {/* divider */}
        <div className="w-px bg-neutral-200/70 my-6" />

        {/* AFTER */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2 px-0.5">
            <span className="w-5 h-5 rounded-full bg-[#FFF6DA] flex items-center justify-center"><Check size={12} className="text-[#9A7400]" strokeWidth={3} /></span>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#9A7400]">After</p>
          </div>
          <Node emoji="😋" title="What sounds good?" sub="Pick a mood" />
          <Arrow />
          <Node emoji="⚖️" title="Compare options" sub="Top 2 — straight away" tone="gold" />
          <div className="mt-2 rounded-2xl bg-white border border-dashed border-[#FFCC02]/70 p-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[#FFCC02] flex items-center justify-center"><SlidersHorizontal size={12} className="text-[#2d2000]" /></span>
              <p className="text-[12px] font-extrabold text-neutral-800">Edit preferences</p>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1.5 leading-snug">Lives on the compare screen — tweak mood, cuisine, scene & budget and the two picks re-filter live.</p>
          </div>
        </div>
      </div>

      {/* footer takeaway */}
      <div className="px-5 pb-8 pt-3">
        <div className="rounded-2xl bg-neutral-900 px-4 py-3 flex items-center gap-3">
          <span className="text-[20px]">⚡</span>
          <p className="text-[12.5px] font-bold text-white leading-snug">One less screen to reach a decision — and preferences stay editable in context.</p>
        </div>
      </div>
    </div>
  );
}
