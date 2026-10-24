import { useEffect, useMemo, useState } from 'react';
import { byFrequency } from '@/lib/i18n';
import { cls, filterChip } from '@/lib/cls';
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
  all?: boolean;
  labels: {
    all: string; filter: string; displayOnly: string; loadMore: string; more: string; showLess: string;
    screenshots: string; noImages: string; screenshot: string; previous: string; next: string; close: string;
  };
}

const LIMIT = 6;

export default function Projects({ projects, all = false, labels }: Props) {
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(all);
  const [lb, setLb] = useState<{ id: string; i: number } | null>(null);

  const techs = useMemo(() => byFrequency(projects.map((p) => p.stack)), [projects]);
  const filtered = projects.filter((p) => filter === 'All' || p.stack.includes(filter));
  const hidden = showAll ? 0 : Math.max(0, filtered.length - LIMIT);
  const cards = showAll ? filtered : filtered.slice(0, LIMIT);
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
            <button key={k} type="button" aria-pressed={on} className={filterChip(on)} onClick={() => { setFilter(k); setShowAll(all); }}>
              {on && <span className="ms text-lg">check</span>}
              {k === 'All' ? labels.all : k}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-4">
        {cards.map((p) => (
          <article
            key={p.id}
            onClick={() => p.url && window.open(p.url, '_blank', 'noopener')}
            className={'flex flex-col overflow-hidden rounded-[28px] bg-surface-high hover:shadow-[0_2px_8px_rgba(0,0,0,.2)] ' + (p.url ? 'cursor-pointer' : 'cursor-default')}
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
              <h3 className={cls.h3}>
                {p.url ? <a href={p.url} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="text-inherit no-underline hover:text-inherit">{p.name}</a> : p.name}
              </h3>
              <p className="m-0 text-[15px] leading-[22px] text-pretty text-on-surface-variant">{p.desc}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {p.stack.map((s) => <span key={s} className={cls.tag}>{s}</span>)}
              </div>
            </div>
            <div className="flex min-h-12 items-center gap-1 px-3 pt-1 pb-3">
              {p.links.map((l) => (
                <a key={l.url + l.icon} href={l.url} target="_blank" rel="noopener" title={l.title} aria-label={l.title} onClick={(e) => e.stopPropagation()} className={cls.iconBtn + ' text-primary hover:text-primary'}>
                  <span className="ms">{l.icon}</span>
                </a>
              ))}
              {!p.url && <span className="ml-3 text-xs tracking-[.4px] text-on-surface-variant">{labels.displayOnly}</span>}
              {p.url && <span className="ms mr-2 ml-auto text-on-surface-variant">north_east</span>}
            </div>
          </article>
        ))}
      </div>

      {hidden > 0 && <MoreButton open={false} hidden={hidden} collapsible={false} labels={labels} onClick={() => setShowAll(true)} />}

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
              <button type="button" onClick={() => step(-1)} aria-label={labels.previous} className={cls.iconBtn + ' text-on-surface'}><span className="ms">chevron_left</span></button>
              <span className="min-w-[120px] text-center text-sm font-medium">{lbProject.name} · {lb.i + 1} / {lbProject.images.length}</span>
              <button type="button" onClick={() => step(1)} aria-label={labels.next} className={cls.iconBtn + ' text-on-surface'}><span className="ms">chevron_right</span></button>
              <button type="button" onClick={() => setLb(null)} aria-label={labels.close} className={cls.iconBtn + ' text-on-surface'}><span className="ms">close</span></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
