import { cls } from '@/lib/cls';

interface Props {
  open: boolean;
  hidden: number;
  /** Projects' Load more only expands; it never collapses. */
  collapsible?: boolean;
  labels: { loadMore: string; more: string; showLess: string };
  onClick: () => void;
}

export function MoreButton({ open, hidden, collapsible = true, labels, onClick }: Props) {
  if (open && !collapsible) return null;
  return (
    <button type="button" onClick={onClick} aria-expanded={open} className={cls.moreBtn}>
      {open ? labels.showLess : `${labels.loadMore} · ${hidden} ${labels.more}`}
      <span className="ms text-xl">{open ? 'expand_less' : 'expand_more'}</span>
    </button>
  );
}
