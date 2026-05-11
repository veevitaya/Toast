import { motion } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

export const BRAND = {
  yellow: '#FFCC02',
  cream: '#FFF8E1',
  charcoal: '#222222',
  lightYellow: '#FFE889',
  orange: '#FF9F1C',
  softGray: '#F5F5F5',
};

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: BRAND.cream,
        fontFamily: '"Figtree", "Inter", system-ui, -apple-system, sans-serif',
        color: BRAND.charcoal,
        WebkitFontSmoothing: 'antialiased',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: 390, position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}

export function TopBar({
  step,
  total,
  onBack,
  onSkip,
  hideBack = false,
}: {
  step: number;
  total: number;
  onBack?: () => void;
  onSkip?: () => void;
  hideBack?: boolean;
}) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: '14px 20px 12px',
        background: BRAND.cream,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <button
        onClick={onBack}
        disabled={hideBack || step === 0}
        aria-label="Back"
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          background: 'rgba(34,34,34,0.06)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hideBack || step === 0 ? 0 : 1,
          pointerEvents: hideBack || step === 0 ? 'none' : 'auto',
          cursor: 'pointer',
          color: BRAND.charcoal,
        }}
      >
        <ChevronLeft size={18} />
      </button>
      <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: 'center' }}>
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === step ? 22 : 6,
              backgroundColor: i <= step ? BRAND.charcoal : 'rgba(34,34,34,0.18)',
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            style={{ height: 6, borderRadius: 999 }}
          />
        ))}
      </div>
      {onSkip ? (
        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(34,34,34,0.55)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            padding: '8px 4px',
          }}
        >
          Skip
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}
    </div>
  );
}

export function CTA({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  const isPrimary = variant === 'primary';
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '16px 24px',
        borderRadius: 999,
        background: isPrimary ? BRAND.charcoal : '#fff',
        color: isPrimary ? '#fff' : BRAND.charcoal,
        border: isPrimary ? 'none' : `1.5px solid ${BRAND.charcoal}`,
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        boxShadow: isPrimary && !disabled ? '0 6px 20px -8px rgba(34,34,34,0.45)' : 'none',
        transition: 'opacity 0.2s, box-shadow 0.2s',
      }}
    >
      {label}
    </motion.button>
  );
}

export function StickyBottom({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        padding: '16px 20px 28px',
        background: `linear-gradient(to top, ${BRAND.cream} 65%, rgba(255,248,225,0))`,
      }}
    >
      {children}
    </div>
  );
}

export function MascotBubble({
  message,
  emoji = '🍞',
  tone = 'yellow',
}: {
  message: string;
  emoji?: string;
  tone?: 'yellow' | 'orange' | 'white';
}) {
  const bg = tone === 'yellow' ? BRAND.lightYellow : tone === 'orange' ? '#FFE3C2' : '#fff';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 22 }}
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        padding: '12px 14px',
        background: bg,
        borderRadius: 18,
        borderTopLeftRadius: 6,
        margin: '0 4px',
      }}
    >
      <motion.div
        animate={{ rotate: [0, -6, 6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6 }}
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(34,34,34,0.08)',
        }}
      >
        {emoji}
      </motion.div>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.4,
          color: BRAND.charcoal,
          fontWeight: 500,
          paddingTop: 6,
        }}
      >
        {message}
      </p>
    </motion.div>
  );
}

export function StepHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ padding: '8px 24px 4px' }}>
      {eyebrow ? (
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.14em',
            color: BRAND.orange,
            marginBottom: 8,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      <h1
        style={{
          margin: 0,
          fontSize: 28,
          lineHeight: 1.1,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: BRAND.charcoal,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          margin: '8px 0 0',
          fontSize: 15,
          lineHeight: 1.45,
          color: 'rgba(34,34,34,0.65)',
          fontWeight: 500,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

export function CompletionScreen({
  title,
  subtitle,
  ctaLabel,
  onRestart,
  emoji,
}: {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onRestart: () => void;
  emoji: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 28px 28px',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        style={{
          width: 88,
          height: 88,
          borderRadius: 999,
          background: BRAND.yellow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 42,
          marginBottom: 20,
          boxShadow: `0 12px 30px -10px ${BRAND.yellow}`,
        }}
      >
        {emoji}
      </motion.div>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</h1>
      <p
        style={{
          margin: '10px 0 28px',
          fontSize: 15,
          color: 'rgba(34,34,34,0.65)',
          fontWeight: 500,
          lineHeight: 1.45,
          maxWidth: 280,
        }}
      >
        {subtitle}
      </p>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={onRestart}
          style={{
            background: 'none',
            border: 'none',
            color: BRAND.charcoal,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 8,
            opacity: 0.7,
          }}
        >
          Replay tutorial
        </button>
      </div>
      <div
        style={{
          marginTop: 32,
          padding: '14px 18px',
          background: '#fff',
          borderRadius: 14,
          fontSize: 13,
          fontWeight: 600,
          color: 'rgba(34,34,34,0.55)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <X size={14} />
        Tutorial complete — would route to: {ctaLabel}
      </div>
    </div>
  );
}

export function Confetti() {
  const pieces = Array.from({ length: 18 });
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pieces.map((_, i) => {
        const colors = [BRAND.yellow, BRAND.orange, BRAND.charcoal, BRAND.lightYellow, '#fff'];
        const color = colors[i % colors.length];
        const left = (i * 53) % 100;
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: ['-10%', '110%'],
              x: [0, (i % 2 ? 1 : -1) * (20 + (i % 5) * 8)],
              opacity: [0, 1, 1, 0],
              rotate: [0, 280],
            }}
            transition={{ duration: 2.2 + (i % 4) * 0.3, delay: i * 0.06, ease: 'easeIn' }}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: 0,
              width: 8,
              height: 12,
              background: color,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
}
