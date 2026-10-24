import { useEffect, useMemo, useState } from 'react';
import { byFrequency } from '@/domain/i18n';
import { FilterChip, IconButton, Tag, card, text } from '@/ui';
import { MoreButton } from './MoreButton';

export interface ProjectView {
  id: string;
  name: string;
  desc: string;
  stack: string[];
  url: string;
  links: { url: string; icon: string; title: string }[];
  images: { src: string; alt: string }[];
}

interface Props {
  projects: ProjectView[];
  /** Main page: show 6 and link here for the rest (keeping the filter). Omit on the full page. */
  moreHref?: string;
  labels: {
    all: string; filter: string; displayOnly: string; loadMore: string; more: string;
    screenshots: string; noImages: string; screenshot: string; previous: string; next: string; close: string;
  };
}

const LIMIT = 6;

export default function Projects({ projects, moreHref, labels }: Props) {
  const [filter, setFilter] = useState('All');
  const [lb, setLb] = useState<{ id: string; i: number } | null>(null);

  // The full page opens with the filter chosen on the main page (?tech=Flutter).
  useEffect(() => {
    const tech = new URLSearchParams(location.search).get('tech');
    if (tech && projects.some((p) => p.stack.includes(tech))) setFilter(tech);
  }, []);

  const techs = useMemo(() => byFrequency(projects.map((p) => p.stack)), [projects]);
  const filtered = projects.filter((p) => filter === 'All' || p.stack.includes(filter));
  const hidden = moreHref ? Math.max(0, filtered.length - LIMIT) : 0;
  const cards = moreHref ? filtered.slice(0, LIMIT) : filtered;
  const lbProject = lb ? projects.find((p) => p.id === lb.id) : undefined;

  const step = (d: number) =>
    setLb((s) => {
      if (!s) return s;
      const n = projects.find((p) => p.id === s.id)?.images.length || 1;
      return { id: s.id, i: (s.i + d + n) % n };
    });

  useEffect(() => {
    if (!lb) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLb(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [lb]);

  return (
    <>
      <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
        {['All', ...techs].map((k) => {
          const on = filter === k;
          return (
            <FilterChip key={k} selected={on} onClick={() => setFilter(k)}>{k === 'All' ? labels.all : k}</FilterChip>
          );
        })}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-4">
        {cards.map((p) => (
          <article
            key={p.id}
            onClick={() => p.url && window.open(p.url, '_blank', 'noopener')}
            className={card.media + ' ' + (p.url ? 'cursor-pointer' : 'cursor-default')}
          >
            <div
              className={
                'stripes relative flex h-[140px] items-center justify-center bg-cover bg-center p-4 text-center font-mono text-xs text-on-primary-container wide:h-[168px] ' +
                (p.images.length ? 'bg-primary-container' : 'bg-surface-highest')
              }
              style={p.images[0]?.src ? { backgroundImage: `url(${p.images[0].src})` } : undefined}
            >
              {!p.images[0]?.src && (p.images.length ? labels.screenshots : labels.noImages)}
              {p.images.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLb({ id: p.id, i: 0 }); }}
                  className="absolute right-3 bottom-3 flex h-8 items-center gap-1.5 rounded-2xl border-0 bg-surface pr-3 pl-2 font-body text-[13px] font-medium text-on-surface"
                >
                  <span className="ms text-lg">photo_library</span>
                  {p.images.length}
                </button>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 px-5 pt-5 pb-3">
              <h3 className={text.title}>
                {p.url ? <a href={p.url} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="text-inherit no-underline hover:text-inherit">{p.name}</a> : p.name}
              </h3>
              <p className="m-0 text-[15px] leading-[22px] text-pretty text-on-surface-variant">{p.desc}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {p.stack.map((s) => <Tag key={s}>{s}</Tag>)}
              </div>
            </div>
            <div className="flex min-h-12 items-center gap-1 px-3 pt-1 pb-3">
              {p.links.map((l) => (
                <IconButton key={l.url + l.icon} href={l.url} target="_blank" rel="noopener" icon={l.icon} label={l.title} tint="primary" onClick={(e: { stopPropagation(): void }) => e.stopPropagation()} />
              ))}
              {!p.url && <span className="ml-3 text-xs tracking-[.4px] text-on-surface-variant">{labels.displayOnly}</span>}
              {p.url && <span className="ms mr-2 ml-auto text-on-surface-variant">north_east</span>}
            </div>
          </article>
        ))}
      </div>

      {moreHref && hidden > 0 && <MoreButton href={filter === 'All' ? moreHref : `${moreHref}?tech=${encodeURIComponent(filter)}`} hidden={hidden} labels={labels} />}

      {lb && lbProject && (
        <div role="dialog" aria-modal="true" aria-label={lbProject.name} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div onClick={() => setLb(null)} className="absolute inset-0 bg-black/72" />
          <div className="relative flex max-h-full flex-col items-center gap-4">
            {lbProject.images[lb.i]?.src ? (
              <img src={lbProject.images[lb.i].src} alt={lbProject.images[lb.i].alt} className="max-h-[min(70vh,640px)] max-w-[90vw] rounded-[32px] object-contain" />
            ) : (
              <div className="stripes box-border flex aspect-[9/19.5] h-[min(70vh,640px)] items-center justify-center rounded-[32px] bg-primary-container p-6 text-center font-mono text-xs leading-[18px] text-on-primary-container">
                {lbProject.name} — {labels.screenshot} {lb.i + 1}
              </div>
            )}
            <div className="flex items-center gap-2 rounded-[28px] bg-surface-high px-2 py-1 text-on-surface">
              <IconButton icon="chevron_left" label={labels.previous} tint="onSurface" onClick={() => step(-1)} />
              <span className="min-w-[120px] text-center text-sm font-medium">{lbProject.name} · {lb.i + 1} / {lbProject.images.length}</span>
              <IconButton icon="chevron_right" label={labels.next} tint="onSurface" onClick={() => step(1)} />
              <IconButton icon="close" label={labels.close} tint="onSurface" onClick={() => setLb(null)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
