# mishad01.github.io

Personal portfolio — Material 3 (teal), English / বাংলা / Deutsch, with a Firebase-backed admin.
Built from the Claude Design handoff in [`design/`](design/) (`Portfolio Canvas.dc.html`, `Portfolio M3.dc.html`, `Admin M3.dc.html`).

| Layer | Tool |
|---|---|
| Framework | Astro (static output) + TypeScript |
| Interactive parts | React islands |
| Styling | Tailwind CSS v4, M3 colour tokens in `src/styles/global.css` |
| i18n | Astro i18n routing: `/`, `/bn/`, `/de/` |
| Backend | Firebase — Firestore, Auth, Storage, App Check (browser SDK, admin only) |
| Hosting | GitHub Pages via GitHub Actions |

## Routes

| Path | What | Canvas frame |
|---|---|---|
| `/`, `/bn/`, `/de/` | Portfolio (light/dark, mobile) | 1a–1e |
| `/teaching/` | Classes page | 2a |
| `/teaching/<class-id>/` | Class detail | 2b |
| `/experience/`, `/projects/`, `/research/` | Full lists | 3a–3c |
| `/admin/` | Admin: login, dashboard, list, edit + preview, edit on page | 4a–4e |
| `/canvas/` | Review board: every page side by side, pan + zoom (noindex) | — |

On the main page, "Load more" expands lists in place, and the Teaching cards → classes → detail flow swaps in place, as in the final prototype.
URL helpers: `?theme=dark|light` forces a theme without saving it; `/admin/?demo=1&screen=list&sec=projects` opens a demo admin screen (used by the canvas).

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run check
```

Without `FIREBASE_SERVICE_ACCOUNT`, the site builds from `src/data/seed.ts`. `/admin/` talks to the real Firebase project. Add `?demo=1` for a demo where any login works and edits stay in the browser.

## How content flows

```
admin (/admin/)  ──save──▶  Firestore site/draft
                 ──Publish─▶ Firestore site/live  (+ publishedAt)
GitHub Actions (every 15 min) ── site/live newer than deployed /build.json? ──▶ astro build ──▶ Pages
```

Content is fetched **at build time** (fast pages, full SEO), so an edit goes live within about 15 minutes of Publish. A push to `main` or a manual "Run workflow" deploys immediately.
Drafts (`status: draft`) never reach the public build. The admin edits English only; Bangla and German strings are kept as they are, and anything missing falls back to English.

## Firebase setup (one time)

1. ✅ Project `my-portfolio-fd9f0` and its web app exist. The web config is in `src/admin/backend.ts`.
2. **Authentication** → enable Email/Password → add your user → copy its **UID**.
3. **Firestore** and **Storage**: create both. In `firestore.rules` and `storage.rules`, replace `REPLACE_WITH_YOUR_UID` with your UID, then deploy the rules: `npx firebase-tools deploy --only firestore:rules,storage`.
4. **App Check** (recommended): register a reCAPTCHA v3 key for `mishad01.github.io`, then turn on enforcement for Firestore and Storage once the admin works.
5. **Service account** for builds: Project settings → Service accounts → Generate key. Paste the JSON, minified to one line, as a GitHub **secret** named `FIREBASE_SERVICE_ACCOUNT`. The builder uses the Admin SDK, so App Check doesn't block it.
6. GitHub repo → Settings → Secrets and variables → Actions → **Variables**: add `PUBLIC_FIREBASE_APPCHECK_SITE_KEY` once you have one. The other `PUBLIC_FIREBASE_*` variables are optional overrides of the built-in config.
7. Settings → Pages → Source: **GitHub Actions**.
8. Add `mishad01.github.io` to Authentication → Settings → Authorized domains.
9. Open `/admin/`, sign in and press **Publish** once. That copies the seed content into `site/live`.

For local work with real Firebase, copy `.env.example` to `.env` and fill it in.

## Placeholders to replace

- Bracketed copy (`[dates]`, `[location]`, `[Project name 6]` …) in `src/data/seed.ts`, or edit it in the admin.
- `public/cv.pdf` (the hero "Download CV" button links to `/cv.pdf`), or upload a CV in Admin → Contact & links.
- Portrait, project screenshots and research figures: upload them in the admin.
- The email (`hello@example.com`) and the LinkedIn handle.
