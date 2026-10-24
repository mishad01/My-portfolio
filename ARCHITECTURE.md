# Architecture

## Layers

```
src/
├─ domain/      What the site is about. Pure TypeScript, no framework or Firebase.
│   ├─ types.ts         Content model (profile, now, experience, projects, classes, research, education)
│   ├─ i18n.ts          t() with English fallback, date formatting, tag frequency
│   └─ publishing.ts    Rule: drafts never reach visitors
├─ data/        Where content comes from.
│   ├─ content-repository.ts   loadContent(): Firestore site/live (REST, or Admin SDK) → seed fallback
│   ├─ firebase-config.ts      Public web config
│   └─ seed.ts                 Built-in content (from the CV)
├─ ui/          Design system (see below). Knows nothing about content.
├─ features/    One folder per product area; each owns its components and logic.
│   ├─ portfolio/   Public site: Astro sections + React islands + view-model.ts
│   ├─ admin/       Content editor (MVVM, below)
│   └─ canvas/      Design review board
├─ platform/    Browser glue: smooth scroll, canvas frame messaging, language redirect, locale routes
├─ i18n/        UI strings (en / bn / de)
├─ layouts/     HTML shell: SEO meta, hreflang, theme bootstrap
└─ pages/       Routes only — fetch data, pick a feature component, nothing else
```

**Dependency direction:** `pages → features → (ui, data, domain, platform)`, `data → domain`, `ui` and `domain` depend on nothing in `src/`. A feature never imports another feature.

## Patterns

| Where | Pattern | Why |
|---|---|---|
| `data/content-repository.ts` | **Repository** with interchangeable sources (REST, Admin SDK, seed) | Pages ask for "published content" without knowing where it lives. |
| `features/admin/backend.ts` | **Adapter / strategy** behind a `Backend` interface (`firebaseBackend`, `demoBackend`) | The admin works the same against Firebase or the in-browser demo used by the canvas. |
| `features/admin/useAdmin.ts` | **MVVM**: the hook is the view-model (state + commands); screens are views | Screens hold no business logic; behaviour is testable without rendering. |
| `features/admin/schema.ts` | **Mapper** between content items and flat edit forms | Forms stay simple strings; translations survive edits. |
| `features/portfolio/view-model.ts` | **Presenter / view-model** that localises content into plain island props | Islands receive ready-to-render strings; no i18n logic inside them. |
| Astro + React islands | **Islands architecture** | Static HTML for speed and SEO; JavaScript only where there's interaction. |

## Design system (`src/ui/`)

Material 3, teal seed `#006A6A`.

- **Tokens** — `styles/global.css`: M3 colour roles as CSS variables (light + `[data-theme=dark]`), mapped into Tailwind (`bg-primary`, `text-on-surface-variant`, `bg-surface-high` …); type families; breakpoints `wide` (700px) and `nav` (1180px).
- **Recipes** — `ui/classes.ts`: type scale (`text.display / headline / title / label`), layout, tonal roles, `button(variant, size)`, `iconButton(variant, tint)`, `filterChip`, `labelChip`, `tag`, `card`, `field`. Usable from Astro and React.
- **Components** — `ui/*.tsx`: `Icon`, `Button`, `IconButton`, `FilterChip`, `LabelChip`, `Tag`, `TextField`, `Switch`, `Snackbar`.

Rules:
1. Colours only through role tokens — never hex values in components.
2. Use a component or recipe before writing button/chip/card classes by hand. If something is missing, add it to `ui/` first.
3. Icons are Material Symbols via `<Icon>`; icon-only buttons always get a `label`.
4. Interactive elements are real `<button>`/`<a>` elements with focus styles (global `:focus-visible`).
