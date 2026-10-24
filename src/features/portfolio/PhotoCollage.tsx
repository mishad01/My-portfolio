import { useEffect, useState } from 'react';
import { cx } from '@/ui';

/** Tile order in the design; photos[i] fills tile i (Admin → Profile & hero → Hero photos). */
export const COLLAGE_SLOTS = ['graduation', 'portrait', 'classes', 'office', 'project'] as const;
export type CollageSlot = (typeof COLLAGE_SLOTS)[number];

const INTERVAL_MS = 5000;

// Staggered layout from the design; phones scale to ~60%.
const ROWS: { slot: CollageSlot; grow: number; h: string }[][] = [
  [
    { slot: 'graduation', grow: 138, h: 'h-[120px] wide:h-[198px]' },
    { slot: 'portrait', grow: 150, h: 'h-[156px] wide:h-[257px]' },
    { slot: 'classes', grow: 198, h: 'h-[136px] wide:h-[225px]' },
  ],
  [
    { slot: 'office', grow: 304, h: 'h-[118px] wide:h-[196px]' },
    { slot: 'project', grow: 198, h: 'h-[124px] wide:h-[204px]' },
  ],
];

interface Props { photos: string[]; labels: Record<CollageSlot, string>; alt: string }

/**
 * Hero photo collage: five staggered tiles. With more than five photos, the
 * extras rotate through the tiles (tile i shows photos i, i+5, i+10…), one
 * tile at a time, so every uploaded photo gets shown. Tap a tile to advance it.
 */
export default function PhotoCollage({ photos, labels, alt }: Props) {
  const stacks = COLLAGE_SLOTS.map((_, i) => photos.filter((_, j) => j % COLLAGE_SLOTS.length === i));
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
  }, [photos.length]);

  const advance = (i: number) => setShown((s) => s.map((v, k) => (k === i ? (v + 1) % stacks[i].length : v)));

  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-3 wide:gap-4" role="group" aria-label={alt}>
      {ROWS.map((row, r) => (
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
                  <img key={src} src={src} alt={labels[slot]} loading="lazy" className={cx('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', k === shown[i] ? 'opacity-100' : 'opacity-0')} />
                ))}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
