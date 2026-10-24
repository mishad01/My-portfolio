import { useState } from 'react';
import type { ClassItem } from '@/lib/types';
import { cls, filterChip, tones, toneCls } from '@/lib/cls';
import { scrollToId } from '@/lib/scroll';

type View = 'home' | 'list' | 'detail';

interface Props {
  classes: ClassItem[];
  platform: string;
  teachRole: string;
  topics: string[];
  title: string;
  view?: View;
  sel?: string;
  /**
   * Standalone pages (/teaching/, /teaching/<id>/) navigate with links instead
   * of swapping views in place. Value is the language-prefixed /teaching/ path.
   */
  pagesBase?: string;
  /** Where "Back" goes from the standalone list page. */
  backHref?: string;
  labels: {
    platform: string; classes: string; topics: string; viewAll: string; back: string; backAll: string; all: string;
    teachIntro: string; syllabus: string; outcome: string; weeks: string; batches: string; duration: string;
    students: string; level: string; format: string; live: string;
  };
}

const card = 'relative flex cursor-pointer flex-col gap-4 rounded-[28px] p-7 text-left no-underline transition-shadow duration-200 hover:shadow-[0_2px_10px_rgba(0,0,0,.2)]';

export default function Teaching({ classes, platform, teachRole, topics, title, view: view0 = 'home', sel: sel0, pagesBase, backHref, labels: L }: Props) {
  const [view, setView] = useState<View>(view0);
  const [sel, setSel] = useState(sel0);
  const [topic, setTopic] = useState('All');

  const go = (v: View, s?: string) => {
    setView(v);
    setSel(s);
    setTimeout(() => scrollToId('teaching', 70), 30);
  };
  const toneOf = (k: ClassItem) => toneCls[tones[classes.indexOf(k) % 3]];
  const allTopics = ['All', ...new Set(classes.flatMap((k) => k.topics))];
  const kk = classes.find((k) => k.id === sel);

  const back =
    view === 'home' ? null : pagesBase ? (view === 'detail' ? pagesBase : backHref) : null;
  const backLabel = view === 'detail' ? L.backAll : L.back;
  const backCls = 'flex h-12 cursor-pointer items-center gap-2 rounded-3xl border-0 bg-secondary-container pr-5 pl-3.5 text-sm font-medium text-on-secondary-container no-underline hover:text-on-secondary-container hover:opacity-[.92]';

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-4">
        {view !== 'home' &&
          (back ? (
            <a href={back} className={backCls}><span className="ms text-xl">arrow_back</span>{backLabel}</a>
          ) : (
            <button type="button" onClick={() => (view === 'detail' ? go('list') : go('home'))} className={backCls}>
              <span className="ms text-xl">arrow_back</span>{backLabel}
            </button>
          ))}
        {view !== 'detail' && <h2 className={cls.h2}>{view === 'list' ? L.classes : title}</h2>}
      </div>

      {view === 'home' && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          <button type="button" onClick={() => go('list')} className={card + ' border-0 bg-primary-container text-on-primary-container'}>
            <span className="ms self-start text-[32px]">school</span>
            <div className="flex flex-col gap-1">
              <span className="kicker">{L.platform}</span>
              <span className="h-title text-[28px] leading-9">{platform}</span>
            </div>
            <span>{teachRole}</span>
            <span className="mt-auto text-sm">{classes.length} {L.classes}</span>
            <span className="ms absolute top-6 right-6 opacity-70">north_east</span>
          </button>
          <button type="button" onClick={() => go('list')} className={card + ' border-0 bg-surface-low text-on-surface'}>
            <span className="kicker text-on-surface-variant">{L.classes}</span>
            <div className="flex flex-col gap-3">
              {classes.slice(0, 3).map((k) => (
                <div key={k.id} className="flex items-center gap-3">
                  <span className="ms text-xl text-primary">{k.icon}</span>
                  <span className="text-base font-medium">{k.name}</span>
                </div>
              ))}
            </div>
            <span className="mt-auto text-sm font-medium text-primary">{L.viewAll} →</span>
            <span className="ms absolute top-6 right-6 opacity-70">north_east</span>
          </button>
          <button type="button" onClick={() => go('list')} className={card + ' border-0 bg-surface-low text-on-surface'}>
            <span className="kicker text-on-surface-variant">{L.topics}</span>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => <span key={t} className={cls.chipFilled}>{t}</span>)}
            </div>
            <span className="ms absolute top-6 right-6 opacity-70">north_east</span>
          </button>
        </div>
      )}

      {view === 'list' && (
        <div className="flex flex-col gap-6">
          <p className="m-0 max-w-[36em] text-pretty text-on-surface-variant">{L.teachIntro}</p>
          <div className="flex flex-wrap gap-2">
            {allTopics.map((k) => (
              <button key={k} type="button" aria-pressed={topic === k} onClick={() => setTopic(k)} className={filterChip(topic === k)}>
                {topic === k && <span className="ms text-lg">check</span>}
                {k === 'All' ? L.all : k}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-4">
            {classes.filter((k) => topic === 'All' || k.topics.includes(topic)).map((k) => {
              const inner = (
                <>
                  <div className={'stripes relative flex h-[140px] items-center justify-center wide:h-[168px] ' + toneOf(k)}>
                    <span className="ms text-[56px]">{k.icon}</span>
                    <span className="absolute top-3 left-3 flex h-7 items-center rounded-[14px] bg-surface px-3 text-[13px] font-medium text-on-surface">{k.level}</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 px-5 pt-5 pb-3">
                    <h3 className={cls.h3}>{k.name}</h3>
                    <p className="m-0 text-[15px] leading-[22px] text-pretty text-on-surface-variant">{k.desc}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">{k.topics.map((t) => <span key={t} className={cls.tag}>{t}</span>)}</div>
                  </div>
                  <div className="flex items-center gap-4 px-5 pt-2 pb-4 text-[13px] text-on-surface-variant">
                    <span className="flex items-center gap-1.5"><span className="ms text-lg">schedule</span>{k.weeks} {L.weeks}</span>
                    <span className="flex items-center gap-1.5"><span className="ms text-lg">groups</span>{k.batches} {L.batches}</span>
                    <span className="ms ml-auto text-primary">arrow_forward</span>
                  </div>
                </>
              );
              const c = 'flex flex-col overflow-hidden rounded-[28px] bg-surface-high text-left text-on-surface no-underline transition-shadow duration-200 hover:text-on-surface hover:shadow-[0_2px_10px_rgba(0,0,0,.2)]';
              return pagesBase ? (
                <a key={k.id} href={`${pagesBase}${k.id}/`} className={c}>{inner}</a>
              ) : (
                <button key={k.id} type="button" onClick={() => go('detail', k.id)} className={c + ' cursor-pointer border-0 p-0'}>{inner}</button>
              );
            })}
          </div>
        </div>
      )}

      {view === 'detail' && kk && (
        <div className="flex flex-col gap-4">
          <div className={'stripes flex flex-col gap-4 rounded-[36px] p-6 wide:p-12 ' + toneOf(kk)}>
            <span className="ms text-5xl">{kk.icon}</span>
            <span className="kicker">{platform} · {kk.level}</span>
            <h3 className="m-0 h-display text-[clamp(32px,6vw,52px)] leading-[1.05] text-balance">{kk.name}</h3>
            <p className="m-0 max-w-[34em] text-lg leading-7 text-pretty">{kk.desc}</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-4">
            {[
              [L.duration, `${kk.weeks} ${L.weeks}`],
              [L.students, kk.students],
              [L.level, kk.level],
              [L.format, L.live],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1 rounded-3xl bg-surface-high p-5">
                <span className="kicker text-on-surface-variant">{label}</span>
                <span className="h-title text-[26px] leading-[34px]">{value}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-4">
            <div className="flex flex-col gap-2 rounded-[28px] bg-surface-high p-7">
              <span className="kicker mb-2 text-on-surface-variant">{L.syllabus}</span>
              {kk.modules.map((m, i) => (
                <div key={i} className="flex items-center gap-4 py-2">
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-secondary-container text-sm font-semibold text-on-secondary-container">{i + 1}</div>
                  <span>{m}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 rounded-[28px] bg-surface-high p-7">
                <span className="kicker text-on-surface-variant">{L.topics}</span>
                <div className="flex flex-wrap gap-2">{kk.topics.map((t) => <span key={t} className={cls.chipFilled}>{t}</span>)}</div>
              </div>
              <div className="flex flex-col gap-2 rounded-[28px] bg-tertiary-container p-7 text-on-tertiary-container">
                <span className="kicker">{L.outcome}</span>
                <span className="text-lg leading-7 text-pretty">{kk.outcome}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
