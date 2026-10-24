import type { LinkType } from './types';

export const LINK_ICON: Record<LinkType, string> = { github: 'code', linkedin: 'badge', facebook: 'groups', youtube: 'smart_display', playstore: 'android', appstore: 'phone_iphone', website: 'language', other: 'link' };
export const LINK_TITLE: Record<LinkType, string> = { github: 'GitHub', linkedin: 'LinkedIn', facebook: 'Facebook', youtube: 'YouTube', playstore: 'Play Store', appstore: 'App Store', website: 'Website', other: 'Link' };
export const NAV_IDS = ['now', 'experience', 'projects', 'teaching', 'research', 'education', 'contact'] as const;
export const NAV_ICON: Record<(typeof NAV_IDS)[number], string> = { now: 'bolt', experience: 'work', projects: 'apps', teaching: 'school', research: 'science', education: 'workspace_premium', contact: 'mail' };
