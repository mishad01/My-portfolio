/**
 * Design system — Material 3 component styles as class recipes.
 *
 * Colours come only from the M3 role tokens in styles/global.css (primary,
 * secondary-container, surface-high, …), so light/dark is handled there.
 * Astro templates call these recipes directly; React code uses the components
 * in ui/*.tsx, which are built on the same recipes.
 */

const join = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');
export { join as cx };

// ---------------------------------------------------------------- type scale
export const text = {
  display: 'm-0 h-display text-[clamp(56px,10vw,104px)] leading-[.92]',
  headline: 'm-0 h-display text-[32px] leading-[1.1] wide:text-[45px]',
  title: 'm-0 h-title text-[22px] leading-7',
  label: 'kicker',
} as const;

// ---------------------------------------------------------------- layout
export const layout = {
  section: 'px-5 py-12 wide:px-6 wide:py-[88px]',
  container: 'mx-auto flex max-w-[1120px] flex-col',
} as const;

// ---------------------------------------------------------------- colour roles
export type Tone = 'primary' | 'secondary' | 'tertiary';
export const TONES: readonly Tone[] = ['primary', 'secondary', 'tertiary'];
/** Container + on-container pair for a tonal surface. */
export const tone: Record<Tone, string> = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
};
/** 48px rounded icon tile; pair with a `tone` for its colour (Now cards use `tone.primary`). */
export const iconTile = 'flex size-12 flex-none items-center justify-center rounded-2xl';

// ---------------------------------------------------------------- buttons
export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text';
export type ButtonSize = 'md' | 'lg';

const buttonBase = 'inline-flex flex-none cursor-pointer items-center justify-center gap-2 font-medium no-underline transition-opacity disabled:cursor-default';
/** M3 disabled state for container buttons: neutral container, muted label. */
const disabledContainer = 'disabled:bg-surface-highest disabled:text-on-surface-variant disabled:opacity-100';
const buttonVariant: Record<ButtonVariant, string> = {
  filled: `border-0 bg-primary text-on-primary hover:text-on-primary hover:opacity-[.92] ${disabledContainer}`,
  tonal: `border-0 bg-secondary-container text-on-secondary-container hover:text-on-secondary-container hover:opacity-[.92] ${disabledContainer}`,
  outlined: 'border border-outline bg-transparent text-primary hover:bg-surface-mid hover:text-primary disabled:opacity-40',
  text: 'border-0 bg-transparent text-primary hover:bg-surface-highest hover:text-primary disabled:opacity-40',
};
const buttonSize: Record<ButtonSize, string> = {
  md: 'h-10 rounded-[20px] px-6 text-sm',
  lg: 'h-12 rounded-3xl px-6 text-base',
};

/** M3 common button. `icon` tightens the leading padding like the spec. */
export const button = (variant: ButtonVariant = 'filled', size: ButtonSize = 'lg', icon = false) =>
  join(buttonBase, buttonVariant[variant], buttonSize[size], icon && (size === 'lg' ? 'pl-5' : 'pl-4'));

export type IconButtonVariant = 'standard' | 'tonal';
/** Icon colour for standard icon buttons. */
export type IconTint = 'variant' | 'primary' | 'onSurface';
const tints: Record<IconTint, string> = {
  variant: 'text-on-surface-variant hover:text-on-surface-variant',
  primary: 'text-primary hover:text-primary',
  onSurface: 'text-on-surface hover:text-on-surface',
};
export const iconButton = (variant: IconButtonVariant = 'standard', tint: IconTint = 'variant') =>
  join(
    'flex h-10 w-10 flex-none cursor-pointer items-center justify-center rounded-full border-0 no-underline',
    variant === 'tonal' ? 'bg-secondary-container text-on-secondary-container hover:text-on-secondary-container' : join('bg-transparent hover:bg-surface-highest', tints[tint]),
  );

// ---------------------------------------------------------------- chips & tags
/** M3 filter chip. */
export const filterChip = (selected: boolean) =>
  join(
    'box-border flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium',
    selected ? 'border-transparent bg-secondary-container text-on-secondary-container' : 'border-outline bg-transparent text-on-surface-variant',
  );
/** Filled, non-interactive label (skills, topics). */
export const labelChip = 'flex h-8 items-center rounded-lg bg-secondary-container px-3.5 text-sm font-medium text-on-secondary-container';
/** Small outlined tag (tech stack on cards). */
export const tag = 'flex h-6 items-center rounded-lg border border-outline-variant px-2.5 text-xs font-medium text-on-surface-variant';
/** Outlined tag that takes the colour of its tonal parent. */
export const tagOnTone = 'flex h-7 items-center rounded-lg border border-current px-3 text-[13px] font-medium';

// ---------------------------------------------------------------- surfaces
export const card = {
  /** Clickable content card (projects, classes). */
  media: 'flex flex-col overflow-hidden rounded-[28px] bg-surface-high text-on-surface no-underline transition-shadow duration-200 hover:text-on-surface hover:shadow-[0_2px_10px_rgba(0,0,0,.2)]',
  /** Plain filled panel. */
  filled: 'rounded-[28px] bg-surface-high p-7',
  /** Large tonal hero panel. */
  hero: 'rounded-[36px] p-6 wide:p-12',
} as const;

// ---------------------------------------------------------------- form fields
export const field = {
  box: 'flex flex-col gap-0.5 rounded-xl border border-outline px-4 py-2',
  label: 'text-xs text-on-surface-variant',
  input: 'w-full border-0 bg-transparent p-0 text-base leading-6 text-on-surface outline-0',
} as const;
