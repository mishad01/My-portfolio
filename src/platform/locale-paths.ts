import { VISIBLE_LANGS } from '@/domain/types';

/** getStaticPaths entries for a page that exists in every visible language (en unprefixed). */
export const localePaths = () =>
  VISIBLE_LANGS.map((lang) => ({ params: { locale: lang === 'en' ? undefined : lang }, props: { lang } }));
