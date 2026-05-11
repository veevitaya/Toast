import { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneFrame, BRAND } from './_shell';
import { Play, RefreshCw, ChevronLeft, Trash2 } from 'lucide-react';

const GUIDES = [
  {
    id: 'solo',
    title: 'Solo Play',
    subtitle: 'Pick a vibe, swipe food, get places.',
    emoji: '🍞',
    gradient: ['#FFE889', '#FFCC02'],
    steps: 4,
    completed: true,
  },
  {
    id: 'group',
    title: 'Group Play',
    subtitle: 'Invite friends, swipe separately, match together.',
    emoji: '👥',
    gradient: ['#FFD7E5', '#FF6B9D'],
    steps: 6,
    completed: true,
  },
  {
    id: 'trending',
    title: 'Trending',
    subtitle: 'See what’s hot and jump into a decision.',
    emoji: '🔥',
    gradient: ['#FFE3C2', '#FF9F1C'],
    steps: 3,
    completed: false,
  },
];

export default function HelpHub() {
  const [reset, setReset] = useState(false);

  return (
    <PhoneFrame>
      {/* Header */}
      <div
        style={{
          padding: '20px 20px 28px',
          background: BRAND.cream,
          position: 'sticky',
          top: 0,
          zIndex: 5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            aria-label="Back"
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              background: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(34,34,34,0.06)',
            }}
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: BRAND.orange, textTransform: 'uppercase', marginBottom: 6 }}>
          Help · Toast 101
        </div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', color: BRAND.charcoal }}>
          How Toast Works
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: 14, fontWeight: 500, color: 'rgba(34,34,34,0.6)', lineHeight: 1.4 }}>
          Replay any tutorial to see the flow again. Toast won’t auto-show them after the first time.
        </p>
      </div>

      <div style={{ padding: '0 20px 28px' }}>
        {GUIDES.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 22 }}
            style={{
              background: '#fff',
              borderRadius: 22,
              marginBottom: 14,
              overflow: 'hidden',
              boxShadow: '0 8px 22px -14px rgba(34,34,34,0.18)',
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${g.gradient[0]}, ${g.gradient[1]})`,
                padding: '20px 18px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  boxShadow: '0 4px 10px -4px rgba(34,34,34,0.12)',
                }}
              >
                {g.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em', color: BRAND.charcoal }}>
                  {g.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: BRAND.charcoal,
                    opacity: 0.7,
                    marginTop: 2,
                  }}
                >
                  {g.steps} steps · {g.completed ? '✓ Completed' : 'Not seen yet'}
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 18px 16px' }}>
              <p style={{ margin: '0 0 14px', fontSize: 14, color: 'rgba(34,34,34,0.7)', fontWeight: 500, lineHeight: 1.4 }}>
                {g.subtitle}
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 999,
                  background: BRAND.charcoal,
                  color: '#fff',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Play size={14} fill="#fff" />
                Replay tutorial
              </motion.button>
            </div>
          </motion.div>
        ))}

        {/* Quick links */}
        <div style={{ marginTop: 24, marginBottom: 14, fontSize: 11, fontWeight: 800, color: 'rgba(34,34,34,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          More help
        </div>
        {[
          { icon: '📨', label: 'Contact support', sub: 'Get a real human reply' },
          { icon: '📜', label: 'What’s new', sub: 'Recent Toast updates' },
        ].map((row) => (
          <button
            key={row.label}
            style={{
              width: '100%',
              background: '#fff',
              border: 'none',
              borderRadius: 16,
              padding: '14px 16px',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: '0 2px 8px -4px rgba(34,34,34,0.08)',
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: BRAND.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              {row.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{row.label}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(34,34,34,0.55)', marginTop: 1 }}>{row.sub}</div>
            </div>
            <div style={{ color: 'rgba(34,34,34,0.3)' }}>›</div>
          </button>
        ))}

        {/* Dev-only */}
        <div
          style={{
            marginTop: 28,
            padding: 14,
            border: '1.5px dashed rgba(229,72,77,0.35)',
            borderRadius: 14,
            background: 'rgba(229,72,77,0.04)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, color: '#E5484D', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
            Dev / Testing only
          </div>
          <button
            onClick={() => {
              setReset(true);
              setTimeout(() => setReset(false), 1800);
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 12,
              background: '#fff',
              border: '1.5px solid rgba(229,72,77,0.4)',
              color: '#E5484D',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {reset ? <RefreshCw size={14} /> : <Trash2 size={14} />}
            {reset ? 'Cleared! Tutorials will show again.' : 'Reset tutorial memory'}
          </button>
        </div>

        <div style={{ height: 32 }} />
      </div>
    </PhoneFrame>
  );
}
