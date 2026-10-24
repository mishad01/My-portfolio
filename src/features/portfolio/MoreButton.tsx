import { cls } from '@/ui/classes';

interface Props {
  href: string;
  hidden: number;
  labels: { loadMore: string; more: string };
}

/** "Load more · N more" — opens the section's full page. */
export function MoreButton({ href, hidden, labels }: Props) {
  return (
    <a href={href} className={cls.moreBtn + ' no-underline hover:text-on-secondary-container'}>
      {`${labels.loadMore} · ${hidden} ${labels.more}`}
      <span className="ms text-xl">arrow_forward</span>
    </a>
  );
}
