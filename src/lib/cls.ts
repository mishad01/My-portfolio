/** Shared class strings so Astro sections and React islands render identically. */
export const cls = {
  section: 'px-5 py-12 wide:px-6 wide:py-[88px]',
  inner: 'mx-auto flex max-w-[1120px] flex-col',
  h2: 'm-0 h-display text-[32px] leading-[1.1] wide:text-[45px]',
  h3: 'm-0 h-title text-[22px] leading-7',
  tonalBtn:
    'flex h-12 cursor-pointer items-center gap-2 rounded-3xl border-0 bg-secondary-container px-6 text-base font-medium text-on-secondary-container no-underline hover:opacity-[.92]',
  filledBtn:
    'flex h-12 items-center gap-2 rounded-3xl bg-primary pr-6 pl-5 text-base font-medium text-on-primary no-underline hover:text-on-primary hover:opacity-[.92]',
  moreBtn:
    'flex h-12 cursor-pointer items-center gap-2 self-center rounded-3xl border-0 bg-secondary-container pr-6 pl-7 text-base font-medium text-on-secondary-container hover:opacity-[.92]',
  iconBtn:
    'flex h-10 w-10 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-on-surface-variant no-underline hover:bg-surface-highest',
  tag: 'flex h-6 items-center rounded-lg border border-outline-variant px-2.5 text-xs font-medium text-on-surface-variant',
  chipFilled: 'flex h-8 items-center rounded-lg bg-secondary-container px-3.5 text-sm font-medium text-on-secondary-container',
} as const;

/** M3 filter chip classes for selected/unselected. */
export const filterChip = (on: boolean) =>
  'box-border flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium ' +
  (on ? 'border-transparent bg-secondary-container text-on-secondary-container' : 'border-outline bg-transparent text-on-surface-variant');

export const tones = ['primary', 'secondary', 'tertiary'] as const;
export const toneCls = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
} as const;
