import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneFrame,
  TopBar,
  CTA,
  StickyBottom,
  MascotBubble,
  StepHeader,
  CompletionScreen,
  BRAND,
} from './_shell';

const TRENDS = [
  { id: 't1', name: 'Mala Hotpot', emoji: '🍲', badge: 'Trending', heat: 98, gradient: ['#FFD7E5', '#FF6B9D'] },
  { id: 't2', name: 'Matcha Latte', emoji: '🍵', badge: 'Popular nearby', heat: 92, gradient: ['#D4F0DC', '#52BD8A'] },
  { id: 't3', name: 'Korean BBQ', emoji: '🥩', badge: 'Group favorite', heat: 95, gradient: ['#FFE889', '#FF9F1C'] },
  { id: 't4', name: 'Boat Noodles', emoji: '🍜', badge: 'Trending', heat: 89, gradient: ['#FFD2C4', '#E5484D'] },
  { id: 't5', name: 'Mochi Donuts', emoji: '🍩', badge: 'Popular nearby', heat: 86, gradient: ['#FFE3F1', '#FF6B9D'] },
];

const TASTE_TAGS = ['Spicy', 'Numbing', 'Shareable', 'Hot pot', 'Sichuan'];

const NEARBY_SPOTS = [
  { name: 'Mala Master', dist: '6 min', price: '฿฿' },
  { name: 'Sichuan House', dist: '9 min', price: '฿฿฿' },
  { name: 'Hotpot Garden', dist: '12 min', price: '฿฿' },
];

function TrendCard({
  trend,
  onTap,
  expanded,
}: {
  trend: (typeof TRENDS)[number];
  onTap?: () => void;
  expanded?: boolean;
}) {
  return (
    <motion.button
      onClick={onTap}
      whileTap={{ scale: 0.97 }}
      layout
      style={{
        flex: '0 0 auto',
        width: expanded ? '100%' : 220,
        height: expanded ? 'auto' : 280,
        borderRadius: 22,
        overflow: 'hidden',
        background: `linear-gradient(160deg, ${trend.gradient[0]}, ${trend.gradient[1]})`,
        border: 'none',
        cursor: onTap ? 'pointer' : 'default',
        boxShadow: '0 12px 28px -14px rgba(34,34,34,0.3)',
        position: 'relative',
        textAlign: 'left',
        padding: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          background: 'rgba(255,255,255,0.92)',
          padding: '4px 10px',
          borderRadius: 999,
          fontSize: 10,
          fontWeight: 800,
          color: BRAND.charcoal,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        🔥 {trend.badge}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          background: BRAND.charcoal,
          color: BRAND.yellow,
          padding: '4px 10px',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 800,
        }}
      >
        {trend.heat}°
      </div>
      <div
        style={{
          height: expanded ? 200 : 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: expanded ? 96 : 78,
        }}
      >
        {trend.emoji}
      </div>
      <div style={{ background: '#fff', padding: '14px 16px' }}>
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em', color: BRAND.charcoal }}>{trend.name}</div>
        {!expanded ? (
          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(34,34,34,0.55)', marginTop: 2 }}>
            Tap to preview
          </div>
        ) : null}
      </div>
    </motion.button>
  );
}

export default function TrendingTutorial() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [scrollIdx, setScrollIdx] = useState(0);
  const [tappedTrend, setTappedTrend] = useState<string | null>(null);

  useEffect(() => {
    if (step !== 0) return;
    const t = setInterval(() => setScrollIdx((i) => (i + 1) % TRENDS.length), 1800);
    return () => clearInterval(t);
  }, [step]);

  const reset = () => {
    setStep(0);
    setCompleted(false);
    setScrollIdx(0);
    setTappedTrend(null);
  };

  const next = () => {
    if (step === 2) {
      setCompleted(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const ctaLabel = step === 0 ? 'Next' : step === 1 ? (tappedTrend ? 'Next' : 'Tap a card first') : 'Explore Trending';
  const ctaDisabled = step === 1 && !tappedTrend;

  if (completed) {
    return (
      <PhoneFrame>
        <CompletionScreen
          emoji="🔥"
          title="You’re in the loop."
          subtitle="Trending tutorial saved. Replay anytime from Help."
          ctaLabel="/trending/menu"
          onRestart={reset}
        />
      </PhoneFrame>
    );
  }

  const expandedTrend = TRENDS.find((t) => t.id === tappedTrend);

  return (
    <PhoneFrame>
      <TopBar step={step} total={3} onBack={() => setStep((s) => Math.max(0, s - 1))} onSkip={() => setCompleted(true)} />

      <AnimatePresence mode="wait">
        {/* STEP 1: See what's hot */}
        {step === 0 ? (
          <motion.div key="r1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <StepHeader eyebrow="Step 1 · Trending" title="See what’s hot." subtitle="Menus and places people are loving right now." />
            <div style={{ marginTop: 20, paddingLeft: 20, overflow: 'hidden' }}>
              <motion.div
                animate={{ x: -scrollIdx * 232 }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                style={{ display: 'flex', gap: 12 }}
              >
                {[...TRENDS, ...TRENDS].map((t, i) => (
                  <TrendCard key={`${t.id}-${i}`} trend={t} />
                ))}
              </motion.div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
              {TRENDS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === scrollIdx ? 18 : 6,
                    height: 6,
                    borderRadius: 999,
                    background: i === scrollIdx ? BRAND.charcoal : 'rgba(34,34,34,0.18)',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>
            <div style={{ padding: '20px 16px 0' }}>
              <MascotBubble message="Updated every hour from real Toast users in Bangkok." emoji="🔥" tone="orange" />
            </div>
          </motion.div>
        ) : null}

        {/* STEP 2: Tap a trend */}
        {step === 1 ? (
          <motion.div key="r2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <StepHeader eyebrow="Step 2 · Trending" title="Tap anything that catches your eye." subtitle="Toast can turn trends into your next meal." />
            <div style={{ padding: '20px' }}>
              {!expandedTrend ? (
                <motion.div layout style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {TRENDS.slice(0, 4).map((t) => (
                    <motion.button
                      key={t.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTappedTrend(t.id)}
                      style={{
                        height: 150,
                        borderRadius: 18,
                        background: `linear-gradient(160deg, ${t.gradient[0]}, ${t.gradient[1]})`,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 8px 18px -10px rgba(34,34,34,0.2)',
                        position: 'relative',
                        padding: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ background: 'rgba(255,255,255,0.92)', padding: '3px 8px', borderRadius: 999, fontSize: 9, fontWeight: 800, color: BRAND.charcoal, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🔥 {t.badge}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: BRAND.charcoal }}>{t.name}</div>
                        <div style={{ fontSize: 32 }}>{t.emoji}</div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} layout>
                  <TrendCard trend={expandedTrend} expanded />
                  <div style={{ marginTop: 14, background: '#fff', borderRadius: 18, padding: 16, boxShadow: '0 4px 14px -8px rgba(34,34,34,0.15)' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(34,34,34,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Taste tags</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {TASTE_TAGS.map((t) => (
                        <span key={t} style={{ padding: '4px 10px', borderRadius: 999, background: BRAND.cream, fontSize: 11, fontWeight: 700 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(34,34,34,0.06)' }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(34,34,34,0.5)', textTransform: 'uppercase' }}>Price</div>
                        <div style={{ fontSize: 14, fontWeight: 800 }}>฿฿</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(34,34,34,0.5)', textTransform: 'uppercase' }}>Heat</div>
                        <div style={{ fontSize: 14, fontWeight: 800 }}>{expandedTrend.heat}°</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(34,34,34,0.5)', textTransform: 'uppercase' }}>Nearby</div>
                        <div style={{ fontSize: 14, fontWeight: 800 }}>{NEARBY_SPOTS.length} spots</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      {NEARBY_SPOTS.map((s) => (
                        <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid rgba(34,34,34,0.04)' }}>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(34,34,34,0.55)' }}>
                            {s.price} · {s.dist}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setTappedTrend(null)}
                      style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: BRAND.orange, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      ← Back to grid
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            <div style={{ padding: '0 16px' }}>
              <MascotBubble message={tappedTrend ? 'Nice pick. Keep going.' : 'Try tapping any card.'} emoji="👀" />
            </div>
          </motion.div>
        ) : null}

        {/* STEP 3: Use it your way */}
        {step === 2 ? (
          <motion.div key="r3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <StepHeader eyebrow="Step 3 · Trending" title="Use it your way." subtitle="Start solo or send it to the group." />
            <div style={{ padding: '24px 20px' }}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  background: `linear-gradient(160deg, ${BRAND.lightYellow}, ${BRAND.yellow})`,
                  borderRadius: 22,
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: `0 12px 28px -14px ${BRAND.yellow}`,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: BRAND.charcoal, opacity: 0.65 }}>YOUR PICK</div>
                <div style={{ fontSize: 56, marginTop: 6 }}>🍲</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>Mala Hotpot</div>
              </motion.div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: '#fff',
                    border: `1.5px solid ${BRAND.charcoal}`,
                    borderRadius: 18,
                    padding: '18px 12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 4 }}>👤</div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>Try Solo</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(34,34,34,0.55)', marginTop: 2 }}>Just for me</div>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: BRAND.charcoal,
                    border: 'none',
                    borderRadius: 18,
                    padding: '18px 12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    color: '#fff',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 4 }}>👥</div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>Start Group</div>
                  <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.6, marginTop: 2 }}>Invite the crew</div>
                </motion.button>
              </div>
            </div>
            <div style={{ padding: '0 16px' }}>
              <MascotBubble message="Trends are just the shortcut. You still get to choose." emoji="🍞" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div style={{ height: 100 }} />
      <StickyBottom>
        <CTA label={ctaLabel} onClick={next} disabled={ctaDisabled} />
      </StickyBottom>
    </PhoneFrame>
  );
}
