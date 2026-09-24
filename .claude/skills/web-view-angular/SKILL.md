---
name: web-view-angular
description: Project conventions for the web-view Angular 22 app, a prerendered static rebuild of the Royal Group of Cambodia corporate site (standalone, zoneless, signals, ContentService). Use this skill whenever you add or change anything under web-view/src or web-view/public — a page, route, component, service, model, content entry, form, layout piece, image, font or global style — even if the user just says "add a page for X" or "add a company" without mentioning Angular or the folder structure. Also use it before touching nginx.conf, security-headers.conf, the Dockerfile, tools/postbuild.mjs (CSP, sitemap, robots) or the CI workflow, or when adding any third-party script, iframe, font, API or form endpoint.
---

# web-view Angular conventions

Angular 22.1, TypeScript 6.0, standalone components, **zoneless**, **OnPush** by default. The site
is **statically prerendered** (`outputMode: "static"`, `@angular/ssr`), not server-rendered at
runtime: there is no Node server. The project brief (pasted into the first session, and the source
of truth when this skill is silent) lives with the user; this skill records what was set up.

Allowed extra packages: `@angular/aria`, `@angular/cdk`. Don't add any others (no Material, NgRx,
Bootstrap, Tailwind, jQuery, carousel libraries) unless the user asks.

## Where things go

```
src/app/
  app.ts · app.html · app.config.ts · app.config.server.ts
  app.routes.ts          every route, flat, each with loadComponent
  app.routes.server.ts   RenderMode.Prerender everywhere; :slug routes need getPrerenderParams
  core/
    layout/              header/, nav-menu/, mobile-drawer/, footer/, search-overlay/
    services/            content.service.ts (ContentService), seo.service.ts (SeoService)
    models/              hero-slide.ts, company.ts (+ Sector), news-item.ts, milestone.ts
  shared/ui/             section-heading/, video-facade/, news-card/ (reused by 2+ features)
  features/
    home/                home + sections/ (hero-carousel, about-intro, logo-marquee, latest-news)
    who-we-are/          about/, chairman/, milestones/
    portfolio/           portfolio-list/, company-detail/
    investors/  contact/  not-found/
    content-hub/         news/, csr/, media/
    legal/               careers/, privacy/, terms/
  content/               slides.ts, companies.ts, news.ts, milestones.ts (typed arrays)
src/styles/              styles.scss → _fonts, _tokens, _base; _breakpoints (no CSS output)
public/
  fonts/                 self-hosted WOFF2 subsets
  images/                placeholders/, logos/ (SVG), photos/ (WebP/AVIF)
```

Path aliases: `@core/*`, `@layout/*` (= `core/layout`), `@features/*`, `@shared/*`, `@content/*`,
`@env/*`.

Dependency direction: `features → shared, core`. `core/layout → shared, core`. Features don't
import from each other. **Only `ContentService` imports from `@content/*`**. Components read
content through its signals, so content can move to `httpResource()` later without touching them.

## Generating files

Run from `web-view/`, with paths relative to `src/app`. Selector prefix is `rg-`.

| Need | Command | Produces |
|---|---|---|
| Component/page | `npx ng g c features/content-hub/news` | `news/news.{ts,html,scss,spec.ts}`, class `News` |
| Service | `npx ng g s core/services/seo --type=service` | `seo.service.ts`, class `SeoService` |

Services keep the `.service.ts` suffix (the brief names them that way). The v22 CLI generates
`@Service()`, which is auto-provided at root. Keep it rather than `@Injectable({ providedIn })`.
Keep the generated `.spec.ts`.

## Code rules

- Standalone only, no `NgModule`. Don't add zone.js or `ChangeDetectionStrategy.Eager`.
- `inject()` in field initializers; never constructor injection.
- State: `signal()`, `computed()`, `linkedSignal()`. Component API: `input()`, `input.required()`,
  `output()`, `model()`. No decorators for inputs/outputs, no `BehaviorSubject` for component state.
- Templates: `@if`, `@for` (always `track`), `@switch`, `@defer`, `@let`. No `*ngIf`/`*ngFor`/
  `ngClass`/`ngStyle`; use `[class.x]`/`[style.x]`.
- Host bindings in `host: {}`, not `@HostBinding`/`@HostListener`.
- Forms: **Signal Forms** (`@angular/forms/signals`) with `[formField]`. No reactive forms.
- Images: `NgOptimizedImage` (`ngSrc`, width/height; `priority` only on the LCP image). Never
  hotlink royalgroup.com.kh. Filenames kebab-case, no spaces.
- Prerender safety: anything touching `window`, `document`, timers or observers runs in
  `afterNextRender()` or is browser-guarded.
- Route params arrive as `input()`s (`withComponentInputBinding()`), e.g. `CompanyDetail.slug`.
- Adding a company? Its slug must appear in `getPrerenderParams` output, which reads
  `ContentService.companies()`, so adding it to `content/companies.ts` is enough.

## Layout, navigation and SEO (decided in phase 2)

- Navigation data lives once in `core/layout/navigation.ts` (`MAIN_NAV`, `LEGAL_NAV`); header
  and footer both render from it. Add pages there, not in templates.
- The nav uses the **disclosure pattern** (button + `aria-expanded` + list of links), not
  `ngMenuBar`/`role="menu"`. The user chose this over Angular Aria's menu, which is an
  app-menu pattern. `@angular/cdk` supplies the drawer's focus trap.
- `rg-mobile-drawer` wraps the single `rg-nav-menu`: inline from `$md`, modal side panel below
  it. Its TS breakpoint (`COMPACT_QUERY`) must match `$md`.
- SEO is route-driven: give each route a `title` and `data: { description }` (and
  `noindex: true` where needed, `jsonLd` for structured data); `SeoTitleStrategy` calls
  `SeoService.apply`, which also removes JSON-LD on routes without it. JSON-LD holds
  **confirmed facts only**: it's invisible, so a placeholder can't be marked as one
  (`ORGANIZATION_JSON_LD` leaves out logo, address, phone and social profiles for now). Dynamic routes
  use a title `ResolveFn` plus `resolve: { description }`. Absolute URLs use
  `environment.site_url`.
- The skip link's href is built from the current path, because `<base href="/">` turns a bare
  `#main` into `/#main`.

## Pages and shared pieces (phases 3–6)

- Content pages wrap in `<div class="container page">` and open with
  `<header class="page-header"><h1>…</h1><p class="lead">…</p></header>`. Global helpers in
  `_base.scss`: `.page`, `.page-header`, `.prose`, `.stack`, `.lead`, `.section`,
  `.section--mist`, `.button` (+ `--secondary`, `--on-dark`), `.visually-hidden`.
- Shared UI: `rg-section-heading` (h2/h3 + optional link), `rg-external-link` (always use it
  for off-site links), `rg-news-card` (`headingLevel` 2 or 3), `rg-video-facade`
  (youtube-nocookie, loads on click, local poster only).
- Links to an in-page target can't be bare `href="#x"` (base href). Use
  `routerLink` + `[fragment]` (anchor scrolling is on) or a button that focuses the target.
- Home: a visually hidden h1, then hero (h2 slide titles), about intro, logo marquee, latest
  news. The marquee renders the list once; don't duplicate it for looping.
- Contact form: Signal Forms with `[formRoot]`/`[formField]`, an error summary of buttons
  that call `focusBoundControl()`, `aria-invalid`/`aria-describedby` per field. Sending goes
  through the `CONTACT_SENDER` token, which **rejects by default** until a real endpoint
  is provided. `?topic=` preselects the topic.
- Search: `rg-search-overlay` is a native `<dialog>` opened with `showModal()`; the index is
  built from `MAIN_NAV`, `LEGAL_NAV` and `ContentService`. New pages appear in search
  once they're in the nav data.
- `/404` is a real route so the build writes `404/index.html`; nginx serves it for unknown
  URLs with a 404 status.
- Only `--c-error` and `--c-success` exist beyond the approved palette, for form feedback only.
- Dates: pass ISO date strings (`2026-03-14`) to `DatePipe` without a timezone argument;
  Angular reads date-only strings as local dates, so `'UTC'` shifts them by a day east of UTC.

## Build output, headers and CI (phase 7)

- **Build with `npm run build`**, never `npx ng build` alone: npm's `postbuild` hook runs
  `tools/postbuild.mjs` on `dist/web-view/browser`. It's Node built-ins only and safe to re-run.
- The script writes each page's **Content-Security-Policy `<meta>`** with SHA-256 hashes of
  that page's inline scripts (Angular's event-replay contract and per-page bootstrap).
  `security.autoCsp` in angular.json **can't be used**: the builder throws when prerendering is
  on. It also swaps the critical-CSS `onload="this.media='all'"` for one hashed listener.
- CSP rules for new code: no inline event handlers (`onclick=`, `onload=`) or hand-written inline
  scripts in `index.html`; the build fails on handlers. `script-src` never gets
  `'unsafe-inline'`; `style-src` has it (prerendered `<style>` blocks and `style=""`). Any new
  origin (API, form service, embed, font CDN) goes in `POLICY` in `tools/postbuild.mjs`
  (`connect-src`/`form-action`/`frame-src`…), or the browser blocks it.
- The script also writes **sitemap.xml** (every prerendered route whose page has no `noindex`
  and a canonical pointing at itself) and **robots.txt**. The origin comes from the home page's
  canonical, i.e. `environment.site_url`. A new route appears in the sitemap automatically.
- nginx: shared headers live in `security-headers.conf` (nosniff, referrer, `frame-ancestors`,
  `X-Frame-Options`, `Permissions-Policy`). Every `location` that calls `add_header` must also
  `include security-headers.conf;` because a location's add_header replaces the inherited ones,
  and headers on 4xx responses need `always`. The Dockerfile copies the file.
- nginx serves `/404`, `/404/`, `/index.csr.html` as 404, and `/social`, `/social/`,
  `/social/index.html` as 301 to `/latest-news`. Hashed JS/CSS and `/fonts/*.woff2` are
  immutable for a year: fonts aren't hashed, so replacing one means renaming it.
- CI (`.github/workflows/ci.yml`): pull requests to `main` run `npm ci`, lint, test and
  `npm run build` on Node 22 (same as the Dockerfile).

## Styles

- Tokens are CSS custom properties in `_tokens.scss` (colors `--c-*`, `--font-*`, `--fs-*`,
  `--space-1..10`, grid). Components use `var(--token)`; they **don't** `@use 'tokens'`.
- For media queries, `@use 'breakpoints' as bp;` then `@include bp.up(bp.$md) { … }`.
- `--c-gilt` is for the hero only and only on navy (it fails contrast on white).
- No drop shadows or rounded cards. Separate with `--c-mist` bands and `var(--border)` rules.
- Motion only in the hero autoplay and logo marquee; both stop under `prefers-reduced-motion`.
- Component style budget: 4 kB warning, 8 kB error.

## Accessibility bar

Landmarks, one h1 per page, skip link, `aria-expanded` nav buttons (Angular Aria menu), Escape
closes, meaningful alt (company names), visible focus, WCAG AA, works from 360px, no duplicated
mobile/desktop markup. External links: `target="_blank"`, `rel="noopener noreferrer"` and a
visible or screen-reader "opens in a new tab" cue.

## Before calling work done

```bash
npm run build         # production + prerender + postbuild (CSP, sitemap, robots)
npx ng lint
npx ng test --watch=false
```

`ng build` fails if a `:slug` route lacks params; postbuild fails on an inline event handler
or a home page without a canonical. For anything touching nginx or the CSP, also build the
image (`docker build -t web-view .`), run it and check the pages in a browser: CSP violations
appear only there.
