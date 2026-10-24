import { text } from '@/ui';
import { MoreButton } from './MoreButton';

export interface ExpView {
  id: string;
  role: string;
  org: string;
  loc: string;
  summary: string;
  bullets: string[];
  skills: string[];
  dates: string;
  current: boolean;
}

interface Props {
  items: ExpView[];
  /** Main page: show the latest `limit` and link here for the rest. Omit on the full page. */
  moreHref?: string;
  limit?: number;
  labels: { current: string; loadMore: string; more: string };
}

export default function ExperienceList({ items, moreHref, limit = 3, labels }: Props) {
  const shown = moreHref ? items.slice(0, limit) : items;
  return (
    <>
      <div className="flex flex-col gap-4">
        {shown.map((e) => (
          <article
            key={e.id}
            className={
              'grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-8 gap-y-3 rounded-3xl border border-outline-variant p-5 wide:p-6 ' +
              (e.current ? 'bg-surface-low' : 'bg-transparent')
            }
          >
            <div className="flex flex-col gap-1">
              <span className={'text-sm font-medium tracking-[.1px] ' + (e.current ? 'text-primary' : 'text-on-surface')}>{e.dates}</span>
              <span className="text-sm text-on-surface-variant">{e.loc}</span>
              {e.current && (
                <span className="mt-2 flex h-6 items-center self-start rounded-xl bg-primary px-2.5 text-xs font-medium tracking-[.5px] text-on-primary">{labels.current}</span>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-2 wide:col-span-2">
              <h3 className={text.title}>{e.role}</h3>
              <span className="text-base text-on-surface-variant">{e.org}</span>
              <p className="mt-1 mb-0 text-pretty">{e.summary}</p>
              {e.bullets.length > 0 && (
                <ul className="m-0 pl-5 text-on-surface-variant">
                  {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
              {e.skills.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {e.skills.map((s) => <span key={s} className="flex h-7 items-center rounded-lg bg-secondary-container px-3 text-[13px] font-medium text-on-secondary-container">{s}</span>)}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
      {moreHref && items.length > limit && <MoreButton href={moreHref} hidden={items.length - limit} labels={labels} />}
    </>
  );
}
