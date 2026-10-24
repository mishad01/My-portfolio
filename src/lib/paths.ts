import type { Lang } from './types';

/** getStaticPaths entries for a page that exists in every language (en unprefixed). */
export const localePaths = () =>
  (['en', 'bn', 'de'] as Lang[]).map((lang) => ({ params: { locale: lang === 'en' ? undefined : lang }, props: { lang } }));
