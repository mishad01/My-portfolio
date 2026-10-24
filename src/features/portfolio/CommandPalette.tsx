import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon, cx, text } from '@/ui';

export interface Command {
  id: string;
  group: string;
  label: string;
  icon: string;
  hint?: string;
  /** Either navigate… */
  href?: string;
  /** …or run an action. */
  run?: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  commands: Command[];
  labels: { placeholder: string; noResults: string };
}

/** M3-styled command palette (⌘K / Ctrl+K): filter, arrow keys, Enter. */
export function CommandPalette({ open, onClose, commands, labels }: Props) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => (c.label + ' ' + c.group + ' ' + (c.hint ?? '')).toLowerCase().includes(q)) : commands;
  }, [query, commands]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setIndex(0);
    setTimeout(() => input.current?.focus(), 0);
  }, [open]);
  useEffect(() => setIndex(0), [query]);

  if (!open) return null;

  const choose = (c?: Command) => {
    if (!c) return;
    onClose();
    if (c.run) c.run();
    else if (c.href) location.href = c.href;
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); choose(results[index]); }
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };

  let lastGroup = '';
  return (
    <div role="dialog" aria-modal="true" aria-label={labels.placeholder} className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]" onKeyDown={onKey}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex max-h-[70vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[28px] bg-surface-high text-on-surface shadow-[0_12px_32px_rgba(0,0,0,.25)]">
        <div className="flex items-center gap-3 border-b border-outline-variant px-5">
          <Icon name="search" className="text-on-surface-variant" />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.placeholder}
            aria-label={labels.placeholder}
            role="combobox"
            aria-expanded="true"
            aria-controls="pf-cmd-list"
            aria-activedescendant={results[index] ? `pf-cmd-${results[index].id}` : undefined}
            className="h-14 flex-1 border-0 bg-transparent text-base text-on-surface outline-0"
          />
          <kbd className="rounded-md border border-outline-variant px-1.5 py-0.5 font-body text-xs text-on-surface-variant">Esc</kbd>
        </div>
        <ul id="pf-cmd-list" role="listbox" className="m-0 list-none overflow-y-auto p-2">
          {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-on-surface-variant">{labels.noResults}</li>}
          {results.map((c, i) => {
            const head = c.group !== lastGroup;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {head && <div className={cx(text.label, 'px-4 pt-3 pb-1 text-on-surface-variant')}>{c.group}</div>}
                <button
                  id={`pf-cmd-${c.id}`}
                  type="button"
                  role="option"
                  aria-selected={i === index}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => choose(c)}
                  className={cx('flex h-12 w-full cursor-pointer items-center gap-4 rounded-3xl border-0 px-4 text-left text-[15px]', i === index ? 'bg-secondary-container text-on-secondary-container' : 'bg-transparent text-on-surface')}
                >
                  <Icon name={c.icon} size={22} />
                  <span className="flex-1">{c.label}</span>
                  {c.hint && <span className="text-xs text-on-surface-variant">{c.hint}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
