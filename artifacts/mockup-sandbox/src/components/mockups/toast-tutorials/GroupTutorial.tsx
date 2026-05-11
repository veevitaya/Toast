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
  Confetti,
  BRAND,
} from './_shell';

const SETUP = [
  { id: 'area', icon: '📍', label: 'Area', value: 'Nearby' },
  { id: 'budget', icon: '💸', label: 'Budget', value: '฿฿' },
  { id: 'vibe', icon: '✨', label: 'Vibe', value: 'Casual' },
  { id: 'size', icon: '👥', label: 'Group size', value: '3 friends' },
];

const FRIENDS = [
  { name: 'Mai', emoji: '🐱', color: '#FFD7E5' },
  { name: 'Ken', emoji: '🦊', color: '#FFE889' },
  { name: 'Pim', emoji: '🐻', color: '#D4F0FF' },
];

const REACTIONS = ['I’m starving', 'No spicy please', 'Anything but salad'];

const FALLBACK_CONTROLS = [
  { id: 'distance', icon: '🗺', label: 'Expand distance' },
  { id: 'budget', icon: '💸', label: 'Lower budget' },
  { id: 'vibe', icon: '🎲', label: 'Change vibe' },
  { id: 'spicy', icon: '🌶', label: 'Remove spicy' },
];

export default function GroupTutorial() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [tappedSetting, setTappedSetting] = useState<string | null>(null);
  const [invited, setInvited] = useState(false);
  const [joinedFriends, setJoinedFriends] = useState(0);
  const [swipeStarted, setSwipeStarted] = useState(false);
  const [matchRevealed, setMatchRevealed] = useState(false);
  const [rerolled, setRerolled] = useState(false);

  const reset = () => {
    setStep(0);
    setCompleted(false);
    setTappedSetting(null);
    setInvited(false);
    setJoinedFriends(0);
    setSwipeStarted(false);
    setMatchRevealed(false);
    setRerolled(false);
  };

  // simulate friends joining after invite
  useEffect(() => {
    if (step === 1 && invited) {
      const t1 = setTimeout(() => setJoinedFriends(1), 600);
      const t2 = setTimeout(() => setJoinedFriends(2), 1300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [step, invited]);

  // when entering step 2 with invites already done, ensure 2 friends visible
  useEffect(() => {
    if (step === 2) {
      setJoinedFriends(2);
    }
  }, [step]);

  // animate match reveal on entering step 4
  useEffect(() => {
    if (step === 4) {
      const t = setTimeout(() => setMatchRevealed(true), 700);
      return () => clearTimeout(t);
    } else {
      setMatchRevealed(false);
    }
  }, [step]);

  const next = () => {
    if (step === 5) {
      setCompleted(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const ctaLabel =
    step === 0
      ? 'Next'
      : step === 1
      ? invited
        ? 'Next'
        : 'Tap “Invite” first'
      : step === 2
      ? 'Start Demo Swipe'
      : step === 3
      ? 'Find match'
      : step === 4
      ? 'Next'
      : 'Start Group Play';

  const ctaDisabled = step === 1 && !invited;

  if (completed) {
    return (
      <PhoneFrame>
        <CompletionScreen
          emoji="👥"
          title="Squad’s ready."
          subtitle="Group tutorial saved. You can replay it from Help anytime."
          ctaLabel="/group/setup"
          onRestart={reset}
        />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <TopBar step={step} total={6} onBack={() => setStep((s) => Math.max(0, s - 1))} onSkip={() => setCompleted(true)} />

      <AnimatePresence mode="wait">
        {/* STEP 1: Set the session */}
        {step === 0 ? (
          <motion.div key="g1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <StepHeader eyebrow="Step 1 · Group Play" title="Set the food mission." subtitle="Pick the basics before inviting the hungry ones." />
            <div style={{ padding: '20px 20px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {SETUP.map((s) => (
                <motion.button
                  key={s.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTappedSetting(s.id)}
                  animate={tappedSetting === s.id ? { scale: [1, 1.05, 1] } : {}}
                  style={{
                    background: '#fff',
                    borderRadius: 18,
                    padding: '16px 14px',
                    border: tappedSetting === s.id ? `2px solid ${BRAND.yellow}` : '2px solid transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px -8px rgba(34,34,34,0.15)',
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(34,34,34,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>{s.value}</div>
                </motion.button>
              ))}
            </div>
            <div style={{ padding: '14px 16px 0' }}>
              <MascotBubble message="The host sets the rules. Everyone else brings opinions." emoji="🎯" />
            </div>
          </motion.div>
        ) : null}

        {/* STEP 2: Invite via LINE */}
        {step === 1 ? (
          <motion.div key="g2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <StepHeader eyebrow="Step 2 · Group Play" title="Invite through LINE." subtitle="Send the session link straight to your friends." />
            <div style={{ padding: '20px' }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: 18,
                  padding: 16,
                  boxShadow: '0 4px 18px -10px rgba(34,34,34,0.18)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#06C755', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>
                    LINE
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(34,34,34,0.55)' }}>Share via LINE</div>
                </div>
                <div
                  style={{
                    background: BRAND.cream,
                    borderRadius: 14,
                    padding: '14px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ fontSize: 28 }}>🍞</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>Join my Toast food session</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(34,34,34,0.55)', marginTop: 2 }}>3 friends · Casual · Nearby</div>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setInvited(true)}
                disabled={invited}
                style={{
                  marginTop: 16,
                  width: '100%',
                  padding: '15px 24px',
                  borderRadius: 999,
                  background: invited ? 'rgba(6,199,85,0.15)' : '#06C755',
                  color: invited ? '#06C755' : '#fff',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: invited ? 'default' : 'pointer',
                  boxShadow: invited ? 'none' : '0 6px 16px -6px rgba(6,199,85,0.5)',
                }}
              >
                {invited ? '✓ Invite sent' : 'Invite Friends'}
              </motion.button>

              {/* Friends flying in */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24, height: 56 }}>
                <AnimatePresence>
                  {FRIENDS.slice(0, joinedFriends).map((f, i) => (
                    <motion.div
                      key={f.name}
                      initial={{ y: -40, opacity: 0, rotate: -20 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 16, delay: i * 0.05 }}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 999,
                        background: f.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        boxShadow: '0 4px 12px -4px rgba(34,34,34,0.15)',
                      }}
                    >
                      {f.emoji}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div style={{ padding: '0 16px' }}>
              <MascotBubble message="Tap. Send. Wait for the chaos." emoji="📨" />
            </div>
          </motion.div>
        ) : null}

        {/* STEP 3: Waiting room */}
        {step === 2 ? (
          <motion.div key="g3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <StepHeader eyebrow="Step 3 · Group Play" title="Wait for the crew." subtitle="Friends appear here before swiping starts." />
            <div style={{ padding: '20px' }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: 22,
                  padding: '20px 18px',
                  boxShadow: '0 6px 20px -10px rgba(34,34,34,0.15)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: BRAND.orange }}>● Live lobby</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(34,34,34,0.55)' }}>2/3 hungry humans joined</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { name: 'You (host)', emoji: '🍞', color: BRAND.yellow, joined: true, host: true },
                    { name: 'Mai', emoji: '🐱', color: '#FFD7E5', joined: joinedFriends >= 1 },
                    { name: 'Ken', emoji: '🦊', color: '#FFE889', joined: joinedFriends >= 2 },
                    { name: 'Open seat', emoji: '✨', color: BRAND.softGray, joined: false },
                  ].map((p, i) => (
                    <div
                      key={i}
                      style={{
                        background: p.joined ? BRAND.cream : 'rgba(34,34,34,0.03)',
                        borderRadius: 14,
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        border: p.host ? `1.5px solid ${BRAND.yellow}` : '1.5px solid transparent',
                        opacity: p.joined ? 1 : 0.55,
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 999, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                        {p.emoji}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(34,34,34,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Quick reactions
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {REACTIONS.map((r) => (
                    <motion.button
                      key={r}
                      whileTap={{ scale: 0.92 }}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 999,
                        background: '#fff',
                        border: '1.5px solid rgba(34,34,34,0.1)',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {r}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: '0 16px' }}>
              <MascotBubble message="Start when enough people are in." emoji="👀" />
            </div>
          </motion.div>
        ) : null}

        {/* STEP 4: Everyone swipes */}
        {step === 3 ? (
          <motion.div key="g4" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <StepHeader eyebrow="Step 4 · Group Play" title="Everyone swipes separately." subtitle="No pressure. No awkward voting yet." />
            <div style={{ padding: '20px', position: 'relative', height: 320 }}>
              {/* 3 mini phones */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 20 }}>
                {FRIENDS.map((f, i) => (
                  <motion.div
                    key={f.name}
                    animate={{ y: [0, -8, 0], rotate: [0, i === 1 ? -3 : 3, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                    style={{
                      width: 78,
                      height: 110,
                      borderRadius: 14,
                      background: '#fff',
                      boxShadow: '0 6px 16px -6px rgba(34,34,34,0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 6px',
                      border: '2px solid rgba(34,34,34,0.06)',
                    }}
                  >
                    <div style={{ width: 22, height: 22, borderRadius: 999, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{f.emoji}</div>
                    <div
                      style={{
                        flex: 1,
                        width: '100%',
                        margin: '6px 0',
                        background: `linear-gradient(135deg, ${BRAND.lightYellow}, ${BRAND.yellow})`,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                      }}
                    >
                      {['🍜', '🍱', '🍲'][i]}
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(34,34,34,0.5)' }}>{f.name}</div>
                  </motion.div>
                ))}
              </div>

              {/* Cards flying into center pile */}
              <div style={{ position: 'relative', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ x: (i - 1) * 80, y: -60, opacity: 0, rotate: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1, rotate: (i - 1) * 6 }}
                    transition={{ delay: 0.4 + i * 0.25, type: 'spring', stiffness: 180, damping: 18, repeat: Infinity, repeatDelay: 1.6 }}
                    style={{
                      position: 'absolute',
                      width: 56,
                      height: 72,
                      borderRadius: 10,
                      background: '#fff',
                      boxShadow: '0 6px 14px -6px rgba(34,34,34,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 26,
                    }}
                  >
                    {['🍜', '🍱', '🍲'][i]}
                  </motion.div>
                ))}
              </div>
            </div>
            <div style={{ padding: '0 16px' }}>
              <MascotBubble message="Toast looks for overlap." emoji="🔍" />
            </div>
          </motion.div>
        ) : null}

        {/* STEP 5: Match found */}
        {step === 4 ? (
          <motion.div key="g5" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }} style={{ position: 'relative' }}>
            {matchRevealed ? <Confetti /> : null}
            <StepHeader eyebrow="Step 5 · Group Play" title="Match found." subtitle="Toast found something the group can agree on." />

            <div style={{ padding: '20px' }}>
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                style={{
                  background: `linear-gradient(135deg, ${BRAND.yellow}, ${BRAND.orange})`,
                  borderRadius: 22,
                  padding: '20px 22px',
                  textAlign: 'center',
                  color: BRAND.charcoal,
                  boxShadow: `0 14px 30px -12px ${BRAND.yellow}`,
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', opacity: 0.7 }}>GROUP MATCH</div>
                <div style={{ fontSize: 36, marginTop: 6 }}>🥩</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, letterSpacing: '-0.01em' }}>Korean BBQ</div>
                <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.7, marginTop: 4 }}>3/3 swiped right</div>
              </motion.div>

              {[
                { name: 'Seoul Grill', tag: 'Korean BBQ · 6 min', match: 96 },
                { name: 'Charcoal House', tag: 'Grill · 9 min', match: 91 },
                { name: 'Late Night BBQ', tag: 'Open till 2am', match: 87 },
              ].map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 200, damping: 22 }}
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: '12px 14px',
                    marginBottom: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: '0 4px 14px -8px rgba(34,34,34,0.15)',
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: BRAND.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🍽</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(34,34,34,0.55)', fontWeight: 600 }}>{p.tag}</div>
                  </div>
                  <div style={{ background: BRAND.yellow, padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 800 }}>{p.match}%</div>
                </motion.div>
              ))}
            </div>
            <div style={{ padding: '0 16px' }}>
              <MascotBubble message="Finally. A decision without 47 messages." emoji="🎉" tone="orange" />
            </div>
          </motion.div>
        ) : null}

        {/* STEP 6: No match */}
        {step === 5 ? (
          <motion.div key="g6" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <StepHeader eyebrow="Step 6 · Group Play" title="No match? No problem." subtitle="Adjust the rules and Toast will try again." />
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {FALLBACK_CONTROLS.map((c) => (
                  <button
                    key={c.id}
                    style={{
                      background: '#fff',
                      borderRadius: 14,
                      padding: '12px 12px',
                      border: '1.5px solid rgba(34,34,34,0.08)',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{c.icon}</span>
                    {c.label}
                  </button>
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setRerolled((r) => !r)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 14,
                  background: BRAND.yellow,
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 800,
                  color: BRAND.charcoal,
                  cursor: 'pointer',
                  boxShadow: `0 6px 16px -8px ${BRAND.yellow}`,
                }}
              >
                🎲 Reroll
              </motion.button>

              {/* card shuffle viz */}
              <div style={{ position: 'relative', height: 120, marginTop: 20 }}>
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={`${rerolled}-${i}`}
                    initial={{ x: 0, y: 0, rotate: (i - 1.5) * 8 }}
                    animate={{ x: (i - 1.5) * 30, y: 0, rotate: (i - 1.5) * 8 }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 180, damping: 16 }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      transform: 'translateX(-50%)',
                      width: 70,
                      height: 90,
                      borderRadius: 12,
                      background: '#fff',
                      boxShadow: '0 6px 14px -6px rgba(34,34,34,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
                    }}
                  >
                    {['🍕', '🍣', '🌮', '🥘'][i]}
                  </motion.div>
                ))}
              </div>
            </div>
            <div style={{ padding: '0 16px' }}>
              <MascotBubble message="Toast helps the group escape decision jail." emoji="🗝" />
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
