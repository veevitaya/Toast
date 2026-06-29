import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/* ───────────────────────── BlurImage ─────────────────────────
   Blur-up image load: starts soft + slightly scaled, settles sharp on load.
   Cached-image safe — a layout effect marks already-complete images loaded so
   they never get stuck blurred. Reduce-motion renders a plain <img>. */
interface BlurImageProps {
  src?: string;
  alt?: string;
  className?: string;
  draggable?: boolean;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  style?: React.CSSProperties;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

export function BlurImage({ src, alt, className, draggable, loading, decoding, style, onError }: BlurImageProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, [src]);

  if (reduce) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        draggable={draggable}
        loading={loading}
        decoding={decoding}
        style={style}
        onError={onError}
        onLoad={() => setLoaded(true)}
      />
    );
  }

  return (
    <motion.img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      draggable={draggable}
      loading={loading}
      decoding={decoding}
      style={style}
      onError={onError}
      onLoad={() => setLoaded(true)}
      initial={false}
      animate={
        loaded
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : { opacity: 0.55, scale: 1.06, filter: "blur(14px)" }
      }
      transition={{ duration: 0.5, ease: EASE_OUT }}
    />
  );
}

/* ───────────────────────── CountUp ─────────────────────────
   Animates an integer from 0 → value with an ease-out tween. Renders inline
   (fragment) so it drops into "{value}%" style text. Reduce shows final value. */
export function CountUp({
  value,
  duration = 900,
  format,
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduce]);

  return <>{format ? format(n) : n}</>;
}

/* ───────────────────────── TextMask ─────────────────────────
   Each line rises from behind a clip — premium hero/header reveal. A small
   padding/negative-margin pair keeps descenders from clipping without shifting
   layout. Reduce-motion shows the text in place. */
export function TextMask({
  lines,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  lines: { text: ReactNode; className?: string }[];
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {lines.map((ln, i) => (
        <span
          key={i}
          className="block overflow-hidden"
          style={{ marginBottom: "-0.14em" }}
        >
          <motion.span
            className={`block ${ln.className ?? ""}`}
            style={{ paddingBottom: "0.14em" }}
            initial={reduce ? false : { y: "115%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: reduce ? 0 : delay + i * stagger }}
          >
            {ln.text}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ───────────────────────── Reveal ─────────────────────────
   Alternate-slide scroll reveal: odd rows enter from the right, even from the
   left, settling once when scrolled into view. Offsets are small to avoid
   horizontal scrollbars (parent should be overflow-x-hidden). Reduce = fade. */
export function Reveal({
  children,
  index = 0,
  className,
  amount = 0.25,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const x = index % 2 ? 22 : -22;
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* ───────────────────────── TiltCard ─────────────────────────
   3D tilt that follows a fine pointer (mouse) — touch is untouched so
   horizontal scroll / tap-to-open keep working. Reduce-motion renders a plain
   wrapper. Press/entrance stay on the inner card. */
export function TiltCard({
  children,
  className,
  max = 12,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  const rx = useSpring(0, { stiffness: 300, damping: 20 });
  const ry = useSpring(0, { stiffness: 300, damping: 20 });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Tilt is mouse-only: skip entirely on reduce-motion or coarse/touch pointers
  // so horizontal scroll and tap-to-open stay untouched on mobile.
  if (reduce || !fine) return <div className={className}>{children}</div>;

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      className={className}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 700 }}
    >
      {children}
    </motion.div>
  );
}
