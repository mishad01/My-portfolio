import type { ClassItem, Content, Education, Experience, I18n, LinkType, ListSection, NowCard, Profile, Contact, Project, Research, Section } from '@/domain/types';

export interface Meta { k: Section; name: string; one: string; icon: string; single?: boolean }

export const META: Meta[] = [
  { k: 'profile', name: 'Profile & hero', one: 'profile', icon: 'person', single: true },
  { k: 'now', name: 'Now cards', one: 'card', icon: 'bolt' },
  { k: 'experience', name: 'Experience', one: 'role', icon: 'work' },
  { k: 'projects', name: 'Projects', one: 'project', icon: 'apps' },
  { k: 'classes', name: 'Classes', one: 'class', icon: 'school' },
  { k: 'research', name: 'Research', one: 'paper', icon: 'science' },
  { k: 'education', name: 'Education', one: 'entry', icon: 'workspace_premium' },
  { k: 'contact', name: 'Contact & links', one: 'link', icon: 'alternate_email', single: true },
];
export const meta = (k: Section) => META.find((m) => m.k === k)!;

export type FieldType = 'text' | 'area' | 'tags' | 'lines' | 'select' | 'image' | 'images' | 'file';
export interface Field { k: string; label: string; type: FieldType; options?: string[]; hint?: string; accept?: string }

/** Flat, string-valued form the editor works on (images: string[]). */
export type Form = Record<string, any> & { id: string | null; status?: 'draft' | 'published' };

const T = (k: string, label: string, hint?: string): Field => ({ k, label, type: 'text', hint });
const A = (k: string, label: string): Field => ({ k, label, type: 'area' });
const G = (k: string, label: string): Field => ({ k, label, type: 'tags' });
const Ln = (k: string, label: string): Field => ({ k, label, type: 'lines' });
const S = (k: string, label: string, options: string[]): Field => ({ k, label, type: 'select', options });

export const ICONS = ['work', 'school', 'rocket_launch', 'menu_book', 'flight_takeoff', 'bolt'];
export const CLASS_ICONS = ['flutter_dash', 'account_tree', 'cloud', 'architecture', 'code', 'school'];

export const FIELDS: Record<Section, Field[]> = {
  profile: [T('displayName', 'Display name'), T('heroRole', 'Role line'), A('heroPos', 'Positioning sentence'), T('avail', 'Availability badge'), G('stack', 'Stack chips'), { k: 'portraits', label: 'Portrait photos · first is the cover · 2+ auto-rotate and advance on tap', type: 'images' }, T('fullName', 'Full name (footer)'), T('teachRole', 'Teaching role'), G('teachTopics', 'Teaching topics'), Ln('achievement', 'Achievements')],
  now: [T('label', 'Label'), S('icon', 'Icon', ICONS), S('tone', 'Colour', ['primary', 'secondary', 'tertiary']), A('text', 'Text')],
  experience: [T('role', 'Role'), T('org', 'Organisation'), T('start', 'Start', 'YYYY-MM'), T('end', 'End (or Present)', 'YYYY-MM or Present'), T('location', 'Location'), A('summary', 'Summary'), Ln('bullets', 'Impact bullets'), G('skills', 'Skills')],
  projects: [T('name', 'Name'), A('desc', 'Description'), G('stack', 'Stack'), T('github', 'GitHub URL'), T('live', 'Live / store URL'), { k: 'images', label: 'Images · the first one is the cover', type: 'images' }],
  classes: [T('name', 'Class name'), S('level', 'Level', ['Beginner', 'Intermediate', 'Advanced']), S('icon', 'Icon', CLASS_ICONS), T('weeks', 'Weeks'), T('batches', 'Batches'), T('students', 'Students'), A('desc', 'Description'), G('topics', 'Topics'), Ln('modules', 'Syllabus modules'), A('outcome', 'What students build')],
  research: [S('kind', 'Type', ['Thesis', 'Paper', 'Project']), T('venue', 'Venue / institution'), T('title', 'Title'), A('summary', 'Summary'), G('tags', 'Keywords'), T('link', 'PDF / link'), { k: 'image', label: 'Figure', type: 'image' }],
  education: [T('tag', 'Level tag', 'e.g. BSc · 2022 – 2025'), T('level', 'Programme'), T('inst', 'Institution'), T('result', 'Result'), S('highlight', 'Highlight card', ['No', 'Yes'])],
  contact: [T('email', 'Email'), T('github', 'GitHub URL'), T('linkedin', 'LinkedIn URL'), { k: 'cv', label: 'CV (PDF)', type: 'file', accept: 'application/pdf' }],
};

// --- i18n helpers: the admin edits English only and keeps bn/de as they are.
const en = (v: I18n | undefined) => v?.en ?? '';
/** Keep translations while the English is unchanged; once it changes they're stale, so drop them (pages fall back to English). */
export const setEn = (v: I18n | undefined, s: string): I18n => (v && v.en === s ? v : { en: s });
export const tags = (s: string) => (s || '').split(',').map((x) => x.trim()).filter(Boolean);
const lines = (s: string) => (s || '').split('\n').map((x) => x.trim()).filter(Boolean);
const slug = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-') || 'item';

const linkType = (url: string): LinkType =>
  /play\.google/.test(url) ? 'playstore' : /apps\.apple/.test(url) ? 'appstore' : /youtu/.test(url) ? 'youtube' : /linkedin/.test(url) ? 'linkedin' : /facebook/.test(url) ? 'facebook' : 'website';
const url = (s: string) => (s && !/^(https?:|mailto:|\/|data:)/.test(s) ? `https://${s}` : s);

/** Content item → editor form. */
export function toForm(sec: Section, c: Content, id: string | null): Form {
  if (sec === 'profile') {
    const p = c.profile;
    return { id: 'single', displayName: en(p.displayName), heroRole: en(p.heroRole), heroPos: en(p.heroPos), avail: en(p.avail), stack: p.stack.join(', '), portraits: p.portraits, fullName: p.fullName, teachRole: en(p.teachRole), teachTopics: p.teachTopics.join(', '), achievement: en(p.achievement) };
  }
  if (sec === 'contact') return { id: 'single', ...c.contact };
  const it = id ? (c[sec] as { id: string }[]).find((x) => x.id === id) : undefined;
  if (!it) return blank(sec);
  switch (sec) {
    case 'now': { const n = it as NowCard; return { id: n.id, status: n.status, label: en(n.label), icon: n.icon, tone: n.tone, text: en(n.text) }; }
    case 'experience': { const e = it as Experience; return { id: e.id, status: e.status, role: en(e.role), org: e.org, start: e.start, end: e.end === 'present' ? 'Present' : e.end, location: en(e.location), summary: en(e.summary), bullets: e.bullets.map(en).join('\n'), skills: e.skills.join(', ') }; }
    case 'projects': { const p = it as Project; const gh = p.links.find((l) => l.type === 'github'); const live = p.links.find((l) => l.type !== 'github'); return { id: p.id, status: p.status, name: en(p.name), desc: en(p.desc), stack: p.stack.join(', '), github: gh?.url ?? '', live: live?.url ?? '', images: p.images.map((i) => i.src) }; }
    case 'classes': { const k = it as ClassItem; return { id: k.id, status: k.status, name: k.name, level: k.level, icon: k.icon, weeks: String(k.weeks), batches: String(k.batches), students: k.students, desc: k.desc, topics: k.topics.join(', '), modules: k.modules.join('\n'), outcome: k.outcome }; }
    case 'research': { const r = it as Research; return { id: r.id, status: r.status, kind: r.kind, venue: r.venue, title: en(r.title), summary: en(r.summary), tags: r.tags.join(', '), link: r.link, image: r.image }; }
    case 'education': { const d = it as Education; return { id: d.id, status: d.status, tag: en(d.tag), level: en(d.level), inst: d.inst, result: en(d.result), highlight: d.highlight ? 'Yes' : 'No' }; }
  }
}

export function blank(sec: Section): Form {
  const f: Form = { id: null, status: 'draft' };
  FIELDS[sec].forEach((x) => (f[x.k] = x.type === 'images' ? [] : ''));
  if (sec === 'now') Object.assign(f, { icon: 'bolt', tone: 'primary' });
  if (sec === 'classes') Object.assign(f, { level: 'Beginner', icon: 'school' });
  if (sec === 'research') f.kind = 'Paper';
  if (sec === 'education') Object.assign(f, { tag: 'BSc', highlight: 'No' });
  return f;
}

/** Editor form → content, merged over the original item so translations survive. */
export function applyForm(sec: Section, c: Content, f: Form): Content {
  if (sec === 'profile') {
    const p = c.profile;
    const profile: Profile = { ...p, displayName: setEn(p.displayName, f.displayName), heroRole: setEn(p.heroRole, f.heroRole), heroPos: setEn(p.heroPos, f.heroPos), avail: setEn(p.avail, f.avail), stack: tags(f.stack), portraits: f.portraits || [], fullName: f.fullName, teachRole: setEn(p.teachRole, f.teachRole), teachTopics: tags(f.teachTopics), achievement: setEn(p.achievement, f.achievement) };
    return { ...c, profile };
  }
  if (sec === 'contact') {
    const contact: Contact = { email: f.email, github: url(f.github), linkedin: url(f.linkedin), cv: f.cv };
    return { ...c, contact };
  }
  const list = c[sec] as { id: string }[];
  const orig = f.id ? (list.find((x) => x.id === f.id) as any) : undefined;
  let id = f.id as string | null;
  if (!id) {
    const base = sec === 'classes' ? slug(f.name) : `${sec[0]}${Date.now().toString(36)}`;
    id = base;
    for (let i = 2; list.some((x) => x.id === id); i++) id = `${base}-${i}`;
  }
  const status = f.status ?? 'draft';
  let item: unknown;
  switch (sec) {
    case 'now':
      item = { id, status, icon: f.icon, tone: f.tone || 'primary', label: setEn(orig?.label, f.label), text: setEn(orig?.text, f.text) } satisfies NowCard;
      break;
    case 'experience': {
      const ob: I18n[] = orig?.bullets ?? [];
      const end = /^present$/i.test(f.end.trim()) ? 'present' : f.end.trim();
      item = { id, status, role: setEn(orig?.role, f.role), org: f.org, start: f.start.trim(), end, location: setEn(orig?.location, f.location), summary: setEn(orig?.summary, f.summary), bullets: lines(f.bullets).map((b, i) => setEn(ob[i], b)), skills: tags(f.skills) } satisfies Experience;
      break;
    }
    case 'projects': {
      const o = orig as Project | undefined;
      const gh = url(f.github.trim()), live = url(f.live.trim());
      const oldLive = o?.links.find((l) => l.type !== 'github');
      const rest = (o?.links ?? []).filter((l) => l.type !== 'github' && l !== oldLive);
      const links = [...(gh ? [{ type: 'github' as const, url: gh }] : []), ...(live ? [{ type: linkType(live), url: live }] : []), ...rest];
      const imgs: string[] = f.images ?? [];
      item = { id, status, name: setEn(o?.name, f.name), desc: setEn(o?.desc, f.desc), stack: tags(f.stack), primaryUrl: gh || live, links, images: imgs.map((src, i) => ({ src, alt: o?.images[i]?.alt || `${f.name} screenshot ${i + 1}` })) } satisfies Project;
      break;
    }
    case 'classes':
      item = { id, status, name: f.name, level: f.level, icon: f.icon || 'school', weeks: Number(f.weeks) || 0, batches: Number(f.batches) || 0, students: f.students, desc: f.desc, topics: tags(f.topics), modules: lines(f.modules), outcome: f.outcome } satisfies ClassItem;
      break;
    case 'research':
      item = { id, status, kind: f.kind, venue: f.venue, title: setEn(orig?.title, f.title), summary: setEn(orig?.summary, f.summary), tags: tags(f.tags), link: url(f.link), image: f.image || '' } satisfies Research;
      break;
    case 'education':
      item = { id, status, tag: setEn(orig?.tag, f.tag), level: setEn(orig?.level, f.level), inst: f.inst, result: setEn(orig?.result, f.result), highlight: f.highlight === 'Yes' } satisfies Education;
      break;
  }
  const next = orig ? list.map((x) => (x.id === id ? item : x)) : [...list, item];
  const out = { ...c, [sec]: next } as Content;
  if (sec === 'now') out.profile = { ...out.profile, nowUpdated: new Date().toISOString().slice(0, 10) };
  return out;
}

const fmtYm = (s: string) => {
  const m = /^(\d{4})-(\d{2})$/.exec(s);
  return m ? new Date(+m[1], +m[2] - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : s || '[date]';
};
export const titleOf = (sec: ListSection, it: any): string =>
  ({ now: en(it.label), experience: en(it.role), projects: en(it.name), classes: it.name, research: en(it.title), education: en(it.level) })[sec];
export const subOf = (sec: ListSection, it: any): string =>
  ({
    now: en(it.text),
    experience: `${it.org} · ${fmtYm(it.start)} – ${it.end === 'present' ? 'Present' : fmtYm(it.end)}`,
    projects: (it.stack || []).join(', '),
    classes: `${it.level} · ${it.weeks} weeks`,
    research: `${it.kind} · ${it.venue}`,
    education: it.inst,
  })[sec];
