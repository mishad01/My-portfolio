import { Button } from '@/ui';

/** "Load more · N more" — opens the section's full page. */
export function MoreButton({ href, hidden, labels }: { href: string; hidden: number; labels: { loadMore: string; more: string } }) {
  return (
    <Button href={href} variant="tonal" trailingIcon="arrow_forward" className="self-center">
      {`${labels.loadMore} · ${hidden} ${labels.more}`}
    </Button>
  );
}
