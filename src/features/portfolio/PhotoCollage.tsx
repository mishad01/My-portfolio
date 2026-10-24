import { useEffect, useState } from 'react';
import { COLLAGE_ROWS, type CollageStacks } from '@/domain/collage';
import { COLLAGE_SLOTS, type CollageSlot } from '@/domain/types';
import { cx } from '@/ui';

const INTERVAL_MS = 5000;


interface Props { stacks: CollageStacks; labels: Record<CollageSlot, string>; alt: string; positions?: Record<string, string> }

/**
 * Hero photo collage: five staggered tiles, each with its own photos (set per
 * tile in the admin). Tiles with several photos rotate, one tile at a time;
 * tap a tile to advance it.
 */
export default function PhotoCollage({ stacks: bySlot, labels, alt, positions = {} }: Props) {
  const stacks = COLLAGE_SLOTS.map((s) => bySlot[s] ?? []);
  const key = stacks.map((s) => s.length).join(',');
  const [shown, setShown] = useState<number[]>(() => COLLAGE_SLOTS.map(() => 0));
  const rotating = stacks.map((s, i) => (s.length > 1 ? i : -1)).filter((i) => i >= 0);

  useEffect(() => {
    if (!rotating.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let turn = 0;
    const t = setInterval(() => {
      const i = rotating[turn++ % rotating.length];
      setShown((s) => s.map((v, k) => (k === i ? (v + 1) % stacks[i].length : v)));
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, [key]);

  const advance = (i: number) => setShown((s) => s.map((v, k) => (k === i ? (v + 1) % stacks[i].length : v)));

  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-3 wide:gap-4" role="group" aria-label={alt}>
      {COLLAGE_ROWS.map((row, r) => (
        <div key={r} className="flex items-end gap-3 wide:gap-4">
          {row.map(({ slot, grow, h }) => {
            const i = COLLAGE_SLOTS.indexOf(slot);
            const stack = stacks[i];
            const tile = cx('relative box-border min-w-0 overflow-hidden rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,.1)]', h);
            if (!stack.length) {
              return (
                <div key={slot} className={cx(tile, 'flex flex-col items-center justify-center gap-1.5 border border-dashed border-outline bg-surface-highest p-3 text-center text-[13px] leading-[18px] text-on-surface-variant')} style={{ flex: `${grow} 1 0` }}>
                  <span className="ms text-[22px]" aria-hidden="true">image</span>
                  <span>{labels[slot]}</span>
                </div>
              );
            }
            return (
              <button
                key={slot}
                type="button"
                onClick={() => stack.length > 1 && advance(i)}
                aria-label={labels[slot]}
                className={cx(tile, 'border-0 bg-surface-highest p-0', stack.length > 1 ? 'cursor-pointer' : 'cursor-default')}
                style={{ flex: `${grow} 1 0` }}
              >
                {stack.map((src, k) => (
                  <img key={src} src={src} alt={labels[slot]} loading="lazy" style={{ objectPosition: positions[src] ?? '50% 50%' }} className={cx('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', k === shown[i] ? 'opacity-100' : 'opacity-0')} />
                ))}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
