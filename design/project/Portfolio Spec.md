# Portfolio — Direction, Structure, Schemas

## 1. Visual direction — "Material 3, teal"
Material 3 with a teal seed (#006A6A). Tonal palette, pill buttons, 24–36px rounded containers, filled/tonal surfaces instead of shadows. Light + dark via a toggle (follow `prefers-color-scheme` first).
- **Why:** M3 is the native language of Flutter/Android — the site itself signals mobile craft in the first 10 seconds. Tonal containers give clear hierarchy without heavy imagery; contrast stays WCAG AA by construction.
- **Type:** Roboto Flex (display, variable width), Roboto (body), Noto Sans Bengali for `/bn/`. Self-host subsets for Lighthouse.
- **Motion:** state-layer fades only; smooth scroll and any transitions disabled under `prefers-reduced-motion`.
- **Memorable detail:** the hero portrait uses an asymmetric M3-expressive shape; "Now" cards use the tonal palette as a colour-coded status board.

## 2. Site structure
One scrolling page per language: `/`, `/bn/`, `/de/`. Order: Hero → Now → Experience → Projects → Teaching → Research → Education & achievements → Contact. Sticky header: logo, anchor nav, language switcher, theme toggle. CV + Contact buttons in Hero and Contact; footer on every page.

## 3. Component list (Astro unless noted)
- `BaseLayout` (meta, OG, hreflang, JSON-LD Person, skip link)
- `Header`, `LangSwitcher` (links to `/bn/`, `/de/`; stores choice in localStorage and redirects on first visit only), `ThemeToggle` *(React island)*
- `Hero`, `NowGrid` + `NowCard`, `ExperienceList` + `ExperienceItem`
- `ProjectsSection` *(React island: filter chips + Lightbox)*, `ProjectCard`, `LinkIconButton`, `Lightbox`
- `TeachingSection`, `ResearchCard`, `EducationGrid`, `Achievement`, `ContactSection` (mailto + copy), `Footer`
- Utilities: `t(field, lang)` (falls back to `en`), `formatDate(date, lang)` via `Intl.DateTimeFormat`, `techFilters(projects)` (unique `stack` entries, sorted by count)

## 4. Content layout (one file per item)
```
src/content/
  now/        building.json teaching.json side-project.json learning.json next.json
  experience/ 2025-bs23.json …
  projects/   ke-dibe.json edubridge.json …
  teaching/   ostad.json sessions-*.json
  research/   thesis.json
  education/  bsc-edu.json …
  achievements/ icpc-dhaka.json
  site.json   (name, positioning, email, links, cv path)
```
Collections are validated with Astro Content Collections + Zod; a missing `bn`/`de` key falls back to `en`.

## 5. Schemas (Zod)
```ts
const i18n = z.object({ en: z.string(), bn: z.string().optional(), de: z.string().optional() });
const ym = z.string().regex(/^\d{4}-\d{2}$/);               // "2025-01"

now:        { key: enum[building,teaching,side,learning,next], icon: string, label: i18n, text: i18n, updated: date, order: number }
experience: { role: i18n, org: string, orgUrl?: url, start: ym, end: ym | "present", location: i18n,
              bullets: z.array(i18n).min(2).max(4), skills: string[], order: number }
projects:   { name: i18n, description: i18n, stack: string[],            // drives filters
              primaryUrl?: url,                                          // card tap; omit = display-only
              links: { type: enum[github,linkedin,facebook,youtube,playstore,appstore,website,other], url: url }[],
              images: { src: image, alt: i18n }[], featured?: boolean, order: number }
teaching:   { platform: string, platformUrl?: url, role: i18n, batches: string[], topics: string[],
              sessions: { title: i18n, date: ym, url?: url }[] }
research:   { title: i18n, summary: i18n, keywords: string[], pdf?: url, figure?: image }
education:  { level: i18n, institution: string, location: string, result: i18n, start?: ym, end?: ym | "upcoming" }
achievements:{ title: i18n, event: string, date?: ym }
```
Tech names (`stack`, `skills`, `topics`) are plain strings — never translated.

## 6. Deploy
`astro.config`: `site: https://mishad01.github.io`, `i18n: { defaultLocale: 'en', locales: ['en','bn','de'] }`, `@astrojs/sitemap`. GitHub Actions: `withastro/action` → `actions/deploy-pages` on push to `main`.

## 7. Prototype notes
`Portfolio M3.dc.html` is the visual/interaction prototype (language switch, filters, lightbox, theme). Bracketed `[ ]` text is a placeholder for your final copy; links are placeholders; Bangla/German strings are drafts — the research summary and experience bullets intentionally omit bn/de to demonstrate the English fallback.
