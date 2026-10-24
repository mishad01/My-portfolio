import type { I18n, Lang } from './types';

export const LOCALE: Record<Lang, string> = { en: 'en-GB', bn: 'bn-BD', de: 'de-DE' };

/** Localised field with English fallback. */
export const t = (v: I18n | string | undefined, lang: Lang): string =>
  v == null ? '' : typeof v === 'string' ? v : (v[lang] || v.en || '');

/** "2025-01" → "Jan 2025" in the page language; '' → placeholder. */
export function formatYm(ym: string, lang: Lang, fallback: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return fallback;
  return new Intl.DateTimeFormat(LOCALE[lang], { month: 'short', year: 'numeric' }).format(new Date(+m[1], +m[2] - 1));
}

export function formatDay(ymd: string, lang: Lang): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return ymd;
  return new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(+m[1], +m[2] - 1, +m[3]));
}

/** Path prefix for a language: '' for en, '/bn' for bn. */
export const prefix = (lang: Lang) => (lang === 'en' ? '' : `/${lang}`);
export const href = (lang: Lang, path = '/') => `${prefix(lang)}${path}`;

/** Unique tags sorted by frequency, then alphabetically (drives filter chips). */
export function byFrequency(lists: string[][]): string[] {
  const counts = new Map<string, number>();
  lists.flat().forEach((x) => counts.set(x, (counts.get(x) || 0) + 1));
  return [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)! || a.localeCompare(b));
}
