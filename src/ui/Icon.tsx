import { cx } from './classes';

/** Material Symbols (Outlined) glyph. Decorative by default. */
export function Icon({ name, size, className }: { name: string; size?: number; className?: string }) {
  return (
    <span className={cx('ms', className)} style={size ? { fontSize: size } : undefined} aria-hidden="true">
      {name}
    </span>
  );
}
