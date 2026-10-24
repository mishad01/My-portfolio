export const LANGS = ['en', 'bn', 'de'] as const;
export type Lang = (typeof LANGS)[number];

/**
 * Languages actually offered through routing/the language switcher.
 * German is hidden for now — uncomment it below to bring back /de/ pages
 * and the DE option in the header switcher.
 */
export const VISIBLE_LANGS: Lang[] = ['en', 'bn' /*, 'de' */];

/** Translatable string. Missing bn/de falls back to en. */
export type I18n = { en: string; bn?: string; de?: string };
export type Status = 'published' | 'draft';
export type Tone = 'primary' | 'secondary' | 'tertiary';

interface Item {
  id: string;
  status: Status;
}

/** The five hero-collage tiles, in display order. */
export const COLLAGE_SLOTS = ['graduation', 'portrait', 'classes', 'office', 'project'] as const;
export type CollageSlot = (typeof COLLAGE_SLOTS)[number];

export interface Profile {
  displayName: I18n;
  fullName: string;
  heroRole: I18n;
  heroPos: I18n;
  avail: I18n;
  stack: string[];
  /** Legacy flat list of hero photos; superseded by `collage`, still read when `collage` is empty. */
  portraits: string[];
  /** Hero collage: each tile has its own photos and rotates through them. */
  collage?: Partial<Record<CollageSlot, string[]>>;
  /** Focal point per collage photo URL, as CSS `object-position` (e.g. "62% 20%"); missing → centered. */
  collagePos?: Record<string, string>;
  /** YYYY-MM-DD, shown as “Updated …” on the Now section. */
  nowUpdated: string;
  teachPlatform: string;
  teachRole: I18n;
  teachTopics: string[];
  achievement: I18n;
}

export interface Contact {
  email: string;
  github: string;
  linkedin: string;
  cv: string;
}

export interface NowCard extends Item {
  icon: string;
  label: I18n;
  text: I18n;
  tone: Tone;
}

export interface Experience extends Item {
  role: I18n;
  org: string;
  /** YYYY-MM, or '' when not set yet. */
  start: string;
  /** YYYY-MM, 'present', or ''. */
  end: string;
  location: I18n;
  summary: I18n;
  bullets: I18n[];
  skills: string[];
}

export const LINK_TYPES = ['github', 'linkedin', 'facebook', 'youtube', 'playstore', 'appstore', 'website', 'other'] as const;
export type LinkType = (typeof LINK_TYPES)[number];

export interface Project extends Item {
  name: I18n;
  desc: I18n;
  stack: string[];
  /** Card tap target; empty = display-only. */
  primaryUrl: string;
  links: { type: LinkType; url: string }[];
  images: { src: string; alt: string }[];
}

export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ClassItem extends Item {
  /** URL slug: /teaching/<id>/ */
  id: string;
  icon: string;
  name: string;
  level: Level;
  weeks: number;
  batches: number;
  students: string;
  topics: string[];
  desc: string;
  modules: string[];
  outcome: string;
}

export interface Research extends Item {
  kind: 'Thesis' | 'Paper' | 'Project';
  venue: string;
  title: I18n;
  summary: I18n;
  tags: string[];
  link: string;
  image: string;
}

export interface Education extends Item {
  tag: I18n;
  level: I18n;
  inst: string;
  result: I18n;
  highlight: boolean;
}

export interface Content {
  /** Which built-in content release this was last synced from (see data/seed.ts). */
  seedVersion?: string;
  profile: Profile;
  contact: Contact;
  now: NowCard[];
  experience: Experience[];
  projects: Project[];
  classes: ClassItem[];
  research: Research[];
  education: Education[];
}

export type ListSection = 'now' | 'experience' | 'projects' | 'classes' | 'research' | 'education';
export type Section = 'profile' | 'contact' | ListSection;
