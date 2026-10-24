import type { Section } from '@/domain/types';
import { Icon, Tag, cx, text, tone } from '@/ui';
import { type Form, tags } from '../schema';

interface PreviewModel { surface: string; kicker: string; title: string; body: string; meta: string; tags: string[]; icon: string; cover: boolean; img: string; titleSize: string }

const plain = 'bg-surface-low text-on-surface border-outline-variant';
const tonal = (t: keyof typeof tone) => cx(tone[t], 'border-transparent');
const filled = 'bg-surface-high text-on-surface border-transparent';

/** Form → what the card will look like on the site. Pure. */
function previewOf(sec: Section, f: Form): PreviewModel {
  const base: PreviewModel = { surface: plain, kicker: '', title: '', body: '', meta: '', tags: [], icon: '', cover: false, img: '', titleSize: '24px' };
  switch (sec) {
    case 'profile': return { ...base, surface: tonal('primary'), kicker: f.avail, title: f.displayName, titleSize: '56px', body: f.heroPos, meta: f.heroRole, tags: tags(f.stack), cover: !!f.photo_portrait, img: f.photo_portrait };
    case 'now': return { ...base, surface: tonal((f.tone as keyof typeof tone) || 'primary'), icon: f.icon, kicker: f.label, body: f.text };
    case 'experience': return { ...base, kicker: `${f.start || ''} – ${f.end || ''}`, title: f.role, body: f.summary, meta: f.org + (f.location ? ` · ${f.location}` : ''), tags: tags(f.skills) };
    case 'projects': return { ...base, surface: filled, cover: true, img: f.images?.[0] || '', title: f.name, body: f.desc, tags: tags(f.stack) };
    case 'classes': return { ...base, surface: filled, kicker: `${f.level || ''} · ${f.weeks || '–'} weeks · ${f.batches || '–'} batches`, title: f.name, body: f.desc, meta: f.outcome ? `Students build: ${f.outcome}` : '', tags: tags(f.topics), icon: f.icon };
    case 'research': return { ...base, surface: tonal('tertiary'), cover: true, img: f.image, kicker: `${f.kind || ''} · ${f.venue || ''}`, title: f.title, body: f.summary, tags: tags(f.tags) };
    case 'education': return { ...base, surface: f.highlight === 'Yes' ? tonal('tertiary') : plain, kicker: f.tag, title: f.level, body: f.inst, meta: f.result };
    case 'contact': return { ...base, surface: tonal('secondary'), kicker: 'Contact', title: f.email, titleSize: '28px', body: [f.github, f.linkedin].filter(Boolean).join('\n'), meta: f.cv };
  }
}

export function Preview({ sec, form, showDraft }: { sec: Section; form: Form; showDraft: boolean }) {
  const pv = previewOf(sec, form);
  return (
    <div className="sticky top-[88px] flex flex-col gap-3">
      <div className={cx(text.label, 'flex items-center gap-2 text-on-surface-variant')}><Icon name="visibility" size={18} />Live preview · as visitors see it</div>
      {showDraft && <div className="flex h-9 items-center gap-2 rounded-xl bg-surface-highest px-3.5 text-[13px] font-medium"><Icon name="visibility_off" size={18} />Draft — hidden from the site</div>}
      <div className={cx('flex flex-col overflow-hidden rounded-[28px] border', pv.surface)}>
        {pv.cover && (
          <div className="stripes flex h-40 items-center justify-center bg-primary-container bg-cover bg-center font-mono text-xs text-on-primary-container" style={pv.img ? { backgroundImage: `url(${pv.img})` } : undefined}>
            {!pv.img && 'no image yet'}
          </div>
        )}
        <div className="flex flex-col gap-3 p-6">
          {pv.icon && <Icon name={pv.icon} size={32} />}
          {pv.kicker && <span className={text.label}>{pv.kicker}</span>}
          {pv.title && <span className="h-title leading-[1.15] text-balance" style={{ fontSize: pv.titleSize }}>{pv.title}</span>}
          {pv.body && <span className="whitespace-pre-line text-pretty">{pv.body}</span>}
          {pv.meta && <span className="text-sm opacity-85">{pv.meta}</span>}
          {pv.tags.length > 0 && <div className="flex flex-wrap gap-1.5">{pv.tags.map((t) => <Tag key={t} onTone>{t}</Tag>)}</div>}
        </div>
      </div>
    </div>
  );
}
