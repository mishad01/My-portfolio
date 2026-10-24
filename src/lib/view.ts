import type { Content, Lang } from './types';
import { formatYm, t } from './i18n';
import { LINK_ICON, LINK_TITLE } from './icons';
import { ui } from '@/i18n/ui';
import type { ExpView } from '@/islands/ExperienceList';
import type { ProjectView } from '@/islands/Projects';
import type { ResearchView } from '@/islands/ResearchList';

/** Localise content into the plain props the islands take. */
export function views(c: Content, lang: Lang) {
  const U = ui(lang);
  const experience: ExpView[] = c.experience.map((e) => {
    const current = e.end === 'present';
    const start = formatYm(e.start, lang, U.datesTbd);
    const end = current ? U.present : formatYm(e.end, lang, U.datesTbd);
    return {
      id: e.id, role: t(e.role, lang), org: e.org, loc: t(e.location, lang), summary: t(e.summary, lang),
      bullets: e.bullets.map((b) => t(b, lang)).filter(Boolean), skills: e.skills, dates: `${start} – ${end}`, current,
    };
  });
  const projects: ProjectView[] = c.projects.map((p) => ({
    id: p.id, name: t(p.name, lang), desc: t(p.desc, lang), stack: p.stack, url: p.primaryUrl,
    links: p.links.filter((l) => l.url).map((l) => ({ url: l.url, icon: LINK_ICON[l.type], title: LINK_TITLE[l.type] })),
    images: p.images,
  }));
  const tones = ['tertiary', 'secondary', 'primary'] as const;
  const research: ResearchView[] = c.research.map((r, i) => ({
    id: r.id, kicker: `${r.kind === 'Thesis' ? U.thesis : r.kind} · ${r.venue}`, title: t(r.title, lang), summary: t(r.summary, lang),
    tags: r.tags, link: r.link, image: r.image, fig: `${U.figure} · ${r.link ? 'PDF' : '—'}`, tone: tones[i % 3],
  }));
  const pick = <K extends keyof typeof U>(...k: K[]) => Object.fromEntries(k.map((x) => [x, U[x]])) as Pick<typeof U, K>;
  return {
    U,
    experience,
    projects,
    research,
    moreLabels: pick('loadMore', 'more'),
    projectLabels: pick('all', 'filter', 'displayOnly', 'loadMore', 'more', 'screenshots', 'noImages', 'screenshot', 'previous', 'next', 'close'),
    teachLabels: pick('platform', 'classes', 'topics', 'viewAll', 'back', 'backAll', 'all', 'teachIntro', 'syllabus', 'outcome', 'weeks', 'batches', 'duration', 'students', 'level', 'format', 'live'),
  };
}
