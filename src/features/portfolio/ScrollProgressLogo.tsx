import { useEffect, useRef } from 'react';

const SIZE = 44;
const STROKE = 3;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

/**
 * The "M" logo wrapped in a ring that fills with page scroll progress
 * (0% at the top, 100% at the bottom) and empties when scrolling back.
 * Updated per animation frame without re-rendering React.
 */
export function ScrollProgressLogo({ label, onClick }: { label: string; onClick: (e: React.MouseEvent) => void }) {
  const arc = useRef<SVGCircleElement>(null);
  const wrap = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      arc.current?.setAttribute('stroke-dashoffset', String(C * (1 - p)));
      wrap.current?.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => { removeEventListener('scroll', schedule); removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, []);

  return (
    <a
      ref={wrap}
      href="#top"
      onClick={onClick}
      aria-label={label}
      title={label}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="relative flex flex-none items-center justify-center no-underline"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" strokeWidth={STROKE} className="stroke-outline-variant" />
        <circle ref={arc} cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" strokeWidth={STROKE} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} className="stroke-primary" />
      </svg>
      <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-primary font-[Inter_Tight] text-base font-bold tracking-[-.03em] text-on-primary">M</span>
    </a>
  );
}
