import { toneCls } from '@/lib/cls';
import type { Tone } from '@/lib/types';
import { MoreButton } from './MoreButton';

export interface ResearchView {
  id: string;
  kicker: string;
  title: string;
  summary: string;
  tags: string[];
  link: string;
  image: string;
  fig: string;
  tone: Tone;
}

interface Props {
  items: ResearchView[];
  /** Main page: show the first item and link here for the rest. Omit on the full page. */
  moreHref?: string;
  labels: { loadMore: string; more: string };
}

const TONE_ORDER: Tone[] = ['tertiary', 'secondary', 'primary'];

export default function ResearchList({ items, moreHref, labels }: Props) {
  const shown = moreHref ? items.slice(0, 1) : items;
  return (
    <>
      <div className="flex flex-col gap-4">
        {shown.map((r, i) => {
          const tone = r.tone ?? TONE_ORDER[i % 3];
          const Wrap = r.link ? 'a' : 'div';
          return (
            <Wrap
              key={r.id}
              {...(r.link ? { href: r.link, target: '_blank', rel: 'noopener' } : {})}
              className={'grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-8 rounded-[36px] p-6 no-underline wide:p-12 ' + toneCls[tone]}
            >
              <div className="flex flex-col gap-4">
                <span className="kicker">{r.kicker}</span>
                <h3 className="m-0 h-title text-[28px] leading-9 text-balance">{r.title}</h3>
                <p className="m-0 text-pretty">{r.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {r.tags.map((t, j) => (
                    <span key={j} className="flex h-7 items-center rounded-lg border border-current px-3 text-[13px] font-medium">{t}</span>
                  ))}
                </div>
              </div>
              {r.image ? (
                <img src={r.image} alt="" loading="lazy" className="aspect-[16/10] w-full rounded-3xl bg-surface object-cover" />
              ) : (
                <div className="stripes flex aspect-[16/10] items-center justify-center rounded-3xl bg-surface p-4 text-center font-mono text-xs text-on-surface">{r.fig}</div>
              )}
            </Wrap>
          );
        })}
      </div>
      {moreHref && items.length > 1 && <MoreButton href={moreHref} hidden={items.length - 1} labels={labels} />}
    </>
  );
}
