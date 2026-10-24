import { COLLAGE_SLOTS, type CollageSlot, type Profile } from './types';

export type CollageStacks = Record<CollageSlot, string[]>;

/**
 * Photos for each collage tile. Uses `profile.collage` when any tile has
 * photos; otherwise spreads the legacy `portraits` list across the tiles in
 * order (photo i → tile i mod 5), which is how it was shown before per-tile
 * photos existed.
 */
export function collageStacks(p: Pick<Profile, 'collage' | 'portraits'>): CollageStacks {
  const set = p.collage && COLLAGE_SLOTS.some((s) => p.collage?.[s]?.length);
  return Object.fromEntries(
    COLLAGE_SLOTS.map((slot, i) => [
      slot,
      set ? [...(p.collage?.[slot] ?? [])] : (p.portraits ?? []).filter((_, j) => j % COLLAGE_SLOTS.length === i),
    ]),
  ) as CollageStacks;
}

/** Staggered tile layout from the design (flex-grow + Tailwind heights); phones scale to ~60%. */
export const COLLAGE_ROWS: { slot: CollageSlot; grow: number; h: string }[][] = [
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
