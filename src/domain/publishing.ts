import type { Content } from './types';

/** Drafts never reach visitors: keep only published items in every list section. */
export function publishedOnly(c: Content): Content {
  const p = <T extends { status: string }>(a: T[]) => a.filter((x) => x.status === 'published');
  return { ...c, now: p(c.now), experience: p(c.experience), projects: p(c.projects), classes: p(c.classes), research: p(c.research), education: p(c.education) };
}
