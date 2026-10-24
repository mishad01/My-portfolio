import type { ReactNode } from 'react';
import { filterChip, labelChip, tag, tagOnTone } from './classes';
import { Icon } from './Icon';

/** M3 filter chip: toggles a filter; shows a check when selected. */
export function FilterChip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={filterChip(selected)}>
      {selected && <Icon name="check" size={18} />}
      {children}
    </button>
  );
}

export const LabelChip = ({ children }: { children: ReactNode }) => <span className={labelChip}>{children}</span>;
/** Outlined tag; `onTone` takes the colour of a tonal parent. */
export const Tag = ({ children, onTone = false }: { children: ReactNode; onTone?: boolean }) => <span className={onTone ? tagOnTone : tag}>{children}</span>;
