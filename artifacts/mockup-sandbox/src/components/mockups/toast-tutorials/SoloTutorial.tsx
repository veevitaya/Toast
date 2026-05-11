import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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

const VIBES = [
  { id: 'spicy', emoji: '🌶', label: 'Spicy' },
  { id: 'comfort', emoji: '🍜', label: 'Comfort' },
  { id: 'healthy', emoji: '🥗', label: 'Healthy' },
  { id: 'budget', emoji: '💸', label: 'Budget' },
  { id: 'date', emoji: '❤️', label: 'Date Night' },
  { id: 'drinks', emoji: '🍻', label: 'Drinks' },
];

const SWIPE_DECK = [
  { id: 'a', emoji: '🍜', name: 'Tonkotsu Ramen', tag: 'Comfort · Noodles' },
  { id: 'b', emoji: '🥗', name: 'Crunch Bowl', tag: 'Healthy · Fresh' },
  { id: 'c', emoji: '🌶', name: 'Mala Chicken', tag: 'Spicy · Bold' },
];

const TASTE_TAGS = ['spicy', 'cozy', 'noodle mood', 'budget-friendly', 'late night'];

const RESULT_PLACES = [
  { name: 'Ramen House', tag: 'Noodles · 5 min', match: 94 },
  { name: 'Thai Comfort Bowl', tag: 'Comfort · 8 min', match: 88 },
  { name: 'Late Night Bites', tag: 'Open now · 12 min', match: 82 },
];

function VibeChip({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      animate={selected ? { scale: [1, 1.12, 1] } : {}}
      transition={{ duration: 0.3 }}
      style={{
        padding: '12px 16px',
        borderRadius: 999,
        background: selected ? BRAND.charcoal : '#fff',
        color: selected ? '#fff' : BRAND.charcoal,
        border: selected ? 'none' : '1.5px solid rgba(34,34,34,0.12)',
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: selected ? `0 6px 16px -6px ${BRAND.charcoal}` : '0 1px 2px rgba(0,0,0,0.03)',
        transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
      }}
    >
      <span style={{ fontSize: 16 }}>{emoji}</span>
      {label}
    </motion.button>
  );
}

function SwipeCard({
  card,
  onSwipe,
  active,
  offset,
}: {
  card: (typeof SWIPE_DECK)[number];
  onSwipe: (dir: 'left' | 'right') => void;
  active: boolean;
  offset: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18]);
  const yesOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  return (
    <motion.div
      drag={active ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      style={{
        x: active ? x : 0,
        rotate: active ? rotate : 0,
        position: 'absolute',
        top: offset * 6,
        left: 0,
        right: 0,
        margin: '0 auto',
        width: '88%',
        height: 320,
        borderRadius: 24,
        background: '#fff',
        boxShadow: '0 18px 40px -16px rgba(34,34,34,0.25)',
        zIndex: 10 - offset,
        scale: 1 - offset * 0.04,
        cursor: active ? 'grab' : 'default',
        overflow: 'hidden',
      }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 80) onSwipe('right');
        else if (info.offset.x < -80) onSwipe('left');
      }}
      animate={{ scale: 1 - offset * 0.04 }}
    >
      <div
        style={{
          height: 200,
          background: `linear-gradient(135deg, ${BRAND.lightYellow}, ${BRAND.yellow})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 84,
          position: 'relative',
        }}
      >
        {card.emoji}
        {active ? (
          <>
            <motion.div
              style={{
                opacity: yesOpacity,
                position: 'absolute',
                top: 16,
                left: 16,
                padding: '6px 12px',
                borderRadius: 8,
                background: '#22A06B',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                transform: 'rotate(-8deg)',
              }}
            >
              YES
            </motion.div>
            <motion.div
              style={{
                opacity: nopeOpacity,
                position: 'absolute',
                top: 16,
                right: 16,
                padding: '6px 12px',
                borderRadius: 8,
                background: '#E5484D',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                transform: 'rotate(8deg)',
              }}
            >
              NOPE
            </motion.div>
          </>
        ) : null}
      </div>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em' }}>{card.name}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(34,34,34,0.55)', marginTop: 4 }}>
          {card.tag}
        </div>
      </div>
    </motion.div>
  );
}

function TasteOrb({ tags }: { tags: string[] }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 240,
        height: 240,
        margin: '24px auto 8px',
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 60,
          borderRadius: 999,
          background: `radial-gradient(circle at 30% 30%, ${BRAND.yellow}, ${BRAND.orange})`,
          boxShadow: `0 0 60px -10px ${BRAND.yellow}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 38,
        }}
      >
        🍞
      </motion.div>
      {tags.map((t, i) => {
        const angle = (i / tags.length) * Math.PI * 2;
        const r = 100;
        const x = 120 + Math.cos(angle) * r - 50;
        const y = 120 + Math.sin(angle) * r - 14;
        return (
          <motion.div
            key={t}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 200 }}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 100,
              height: 28,
              borderRadius: 999,
              background: '#fff',
              boxShadow: '0 4px 12px -4px rgba(34,34,34,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: BRAND.charcoal,
            }}
          >
            {t}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function SoloTutorial() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [vibes, setVibes] = useState<string[]>([]);
  const [deckIdx, setDeckIdx] = useState(0);
  const [swipes, setSwipes] = useState<{ id: string; dir: 'left' | 'right' }[]>([]);
  const [reaction, setReaction] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const swipeRequirement = swipes.length >= 2;
  const canAdvanceStep1 = vibes.length > 0;

  const reset = () => {
    setStep(0);
    setCompleted(false);
    setVibes([]);
    setDeckIdx(0);
    setSwipes([]);
    setReaction(null);
    setCollapsed(false);
  };

  const handleSwipe = (dir: 'left' | 'right') => {
    const card = SWIPE_DECK[deckIdx];
    if (!card) return;
    setSwipes((s) => [...s, { id: card.id, dir }]);
    setReaction(dir === 'right' ? 'Yup, that’s a yes.' : 'No hard feelings.');
    setDeckIdx((i) => i + 1);
    setTimeout(() => setReaction(null), 1400);
  };

  const next = () => {
    if (step === 3) {
      setCompleted(true);
    } else {
      setStep((s) => s + 1);
      setReaction(null);
    }
  };

  const ctaLabel = useMemo(() => {
    if (step === 0) return 'Next';
    if (step === 1) return swipeRequirement ? 'Got it' : 'Swipe to continue';
    if (step === 2) return 'Show me how';
    return 'Start Solo Play';
  }, [step, swipeRequirement]);

  const ctaDisabled = (step === 0 && !canAdvanceStep1) || (step === 1 && !swipeRequirement);

  if (completed) {
    return (
      <PhoneFrame>
        <CompletionScreen
          emoji="🍞"
          title="You’re ready to swipe."
          subtitle="Tutorial saved. Toast won’t show this again — replay it anytime from Help."
          ctaLabel="/solo/preferences"
          onRestart={reset}
        />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <TopBar step={step} total={4} onBack={() => setStep((s) => Math.max(0, s - 1))} onSkip={() => setCompleted(true)} />

      <AnimatePresence mode="wait">
        {/* STEP 1: Pick Your Vibe */}
        {step === 0 ? (
          <motion.div
            key="s1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <StepHeader eyebrow="Step 1 · Solo Play" title="Pick your vibe." subtitle="Tell Toast what kind of meal you’re feeling." />
            <div style={{ padding: '20px 20px 12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {VIBES.map((v) => (
                <VibeChip
                  key={v.id}
                  emoji={v.emoji}
                  label={v.label}
                  selected={vibes.includes(v.id)}
                  onClick={() =>
                    setVibes((cur) => (cur.includes(v.id) ? cur.filter((x) => x !== v.id) : [...cur, v.id]))
                  }
                />
              ))}
            </div>

            {/* Taste DNA orb preview */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 20px 8px' }}>
              <motion.div
                animate={{ scale: vibes.length ? [1, 1.08, 1] : 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 999,
                  background: '#fff',
                  boxShadow: '0 4px 14px -6px rgba(34,34,34,0.18)',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: `radial-gradient(circle at 30% 30%, ${BRAND.yellow}, ${BRAND.orange})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                  }}
                >
                  🧬
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  Taste DNA · {vibes.length} {vibes.length === 1 ? 'signal' : 'signals'}
                </div>
              </motion.div>
            </div>

            <div style={{ padding: '10px 16px 0' }}>
              <MascotBubble message="Start with your mood. Toast gets smarter from there." emoji="🍞" />
            </div>
          </motion.div>
        ) : null}

        {/* STEP 2: Swipe */}
        {step === 1 ? (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <StepHeader eyebrow="Step 2 · Solo Play" title="Swipe what looks good." subtitle="Right for yes. Left for nope." />
            <div style={{ position: 'relative', height: 360, margin: '24px 0 8px' }}>
              {SWIPE_DECK.slice(deckIdx, deckIdx + 3)
                .reverse()
                .map((c, idx, arr) => {
                  const offset = arr.length - 1 - idx;
                  return (
                    <SwipeCard
                      key={c.id}
                      card={c}
                      offset={offset}
                      active={offset === 0}
                      onSwipe={handleSwipe}
                    />
                  );
                })}
              {deckIdx >= SWIPE_DECK.length ? (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'rgba(34,34,34,0.5)',
                  }}
                >
                  Nice. That’s enough for the demo.
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, padding: '4px 0 12px' }}>
              <button
                onClick={() => handleSwipe('left')}
                disabled={deckIdx >= SWIPE_DECK.length}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 999,
                  background: '#fff',
                  border: '1.5px solid rgba(229,72,77,0.4)',
                  color: '#E5484D',
                  fontSize: 22,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px -4px rgba(229,72,77,0.25)',
                }}
              >
                ✕
              </button>
              <button
                onClick={() => handleSwipe('right')}
                disabled={deckIdx >= SWIPE_DECK.length}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 999,
                  background: '#fff',
                  border: '1.5px solid rgba(34,160,107,0.4)',
                  color: '#22A06B',
                  fontSize: 22,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px -4px rgba(34,160,107,0.25)',
                }}
              >
                ♥
              </button>
            </div>

            <div style={{ padding: '0 16px', minHeight: 56 }}>
              <AnimatePresence>
                {reaction ? (
                  <motion.div
                    key={reaction}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <MascotBubble message={reaction} emoji="🍞" />
                  </motion.div>
                ) : (
                  <MascotBubble message={`Try one swipe each way (${swipes.length}/2).`} emoji="🍞" />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}

        {/* STEP 3: Toast learns */}
        {step === 2 ? (
          <motion.div
            key="s3"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <StepHeader eyebrow="Step 3 · Solo Play" title="Toast learns your Taste DNA." subtitle="Your swipes turn into better picks." />
            <TasteOrb tags={TASTE_TAGS} />
            <div style={{ padding: '8px 16px 0' }}>
              <MascotBubble message="Every swipe sharpens your profile. No forms to fill." emoji="✨" tone="orange" />
            </div>
          </motion.div>
        ) : null}

        {/* STEP 4: From craving to place */}
        {step === 3 ? (
          <motion.div
            key="s4"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <StepHeader eyebrow="Step 4 · Solo Play" title="From craving to place." subtitle="Toast turns your food mood into real spots nearby." />
            <div style={{ padding: '20px 20px 8px', position: 'relative', minHeight: 280 }}>
              {!collapsed ? (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  {SWIPE_DECK.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ y: 0, opacity: 1 }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                      style={{
                        width: 70,
                        height: 90,
                        borderRadius: 14,
                        background: `linear-gradient(135deg, ${BRAND.lightYellow}, ${BRAND.yellow})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        boxShadow: '0 6px 16px -6px rgba(34,34,34,0.2)',
                      }}
                    >
                      {c.emoji}
                    </motion.div>
                  ))}
                </div>
              ) : null}

              <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0' }}>
                <button
                  onClick={() => setCollapsed((c) => !c)}
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: BRAND.orange,
                    background: 'rgba(255,159,28,0.12)',
                    border: 'none',
                    borderRadius: 999,
                    padding: '6px 12px',
                    cursor: 'pointer',
                  }}
                >
                  {collapsed ? '↺ Replay morph' : '↓ Turn into places'}
                </button>
              </div>

              <AnimatePresence>
                {collapsed
                  ? RESULT_PLACES.map((p, i) => (
                      <motion.div
                        key={p.name}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.12, type: 'spring', stiffness: 220, damping: 22 }}
                        style={{
                          background: '#fff',
                          borderRadius: 16,
                          padding: '12px 14px',
                          marginBottom: 10,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          boxShadow: '0 4px 14px -8px rgba(34,34,34,0.18)',
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: BRAND.cream,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 22,
                          }}
                        >
                          🍽
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 800 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: 'rgba(34,34,34,0.55)', fontWeight: 600 }}>{p.tag}</div>
                        </div>
                        <div
                          style={{
                            background: BRAND.yellow,
                            padding: '4px 10px',
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 800,
                            color: BRAND.charcoal,
                          }}
                        >
                          {p.match}%
                        </div>
                      </motion.div>
                    ))
                  : null}
              </AnimatePresence>
            </div>

            <div style={{ padding: '4px 16px 0' }}>
              <MascotBubble message="You swipe the food. Toast finds the place." emoji="🍞" />
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
