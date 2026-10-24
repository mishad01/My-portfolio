// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mishad01.github.io',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'bn', 'de'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin/') && !page.includes('/canvas/'),
      i18n: { defaultLocale: 'en', locales: { en: 'en', bn: 'bn-BD', de: 'de-DE' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
