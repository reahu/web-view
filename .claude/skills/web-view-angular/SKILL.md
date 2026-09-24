---
name: web-view-angular
description: Project conventions for the web-view Angular 22 app, the prerendered static website of Malin Koh Kong Peace Development Co., Ltd. (sand dredging and supply, Cambodia) in Khmer and English (standalone, zoneless, signals, Angular i18n, ContentService). Use this skill whenever you add or change anything under web-view/src or web-view/public — a page, route, component, service, model, content entry, form, layout piece, image, font, global style or translation — even if the user just says "add a page for X", "change this text" or "fix the Khmer" without mentioning Angular, i18n or the folder structure. Also use it before touching angular.json, src/locale, nginx.conf, security-headers.conf, the Dockerfile, anything in tools/ (postbuild, i18n) or the CI workflow, or when adding any third-party script, iframe, font, API or form endpoint.
---

# web-view Angular conventions

Angular 22.1, TypeScript 6.0, standalone components, **zoneless**, **OnPush** by default. The site
is **statically prerendered** (`outputMode: "static"`, `@angular/ssr`), not server-rendered at
runtime: there is no Node server. It is the website of **Malin Koh Kong Peace Development Co.,
Ltd.**, in **Khmer (at `/`) and English (under `/en/`)**. The codebase began as a rebuild of the
Royal Group of Cambodia site (phases 1–7); phase 8 turned it into Malin's site. Selectors keep
the `rg-` prefix from that time; don't rename them.

Allowed extra packages: `@angular/aria`, `@angular/cdk`, `@angular/localize`. Don't add any others
(no Material, NgRx, Bootstrap, Tailwind, jQuery, carousel or i18n libraries) unless the user asks.

## Where things go

```
src/app/
  app.ts · app.html · app.config.ts · app.config.server.ts
  app.routes.ts          every route, flat, each with loadComponent
  app.routes.server.ts   RenderMode.Prerender for everything
  core/
    i18n/                languages.ts: the languages, their URL prefixes, languagePath()
    layout/              header/, nav-menu/, mobile-drawer/, footer/, language-switch/, navigation.ts
    services/            content.service.ts (ContentService), seo.service.ts (SeoService)
    models/              process-step.ts, org-member.ts (+ OrgNode)
  shared/ui/             section-heading/, external-link/, process-steps/, quote-cta/
  features/
    home/  about/  services/  organisation/  contact/  not-found/
    legal/               privacy/, terms/ (placeholder text until the client's lawyers supply it)
  content/               process.ts, organisation.ts (typed arrays)
src/locale/              messages.km.xlf: the Khmer translation, English source alongside
src/styles/              styles.scss → _fonts, _tokens, _base; _breakpoints (no CSS output)
public/
  fonts/                 self-hosted WOFF2 subsets, Latin and Khmer
  images/                logo/ (the client's logo), placeholders/, photos/ (WebP/AVIF)
tools/                   postbuild.mjs, i18n-merge.mjs, i18n-review.mjs (Node built-ins only)
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
| Component/page | `npx ng g c features/services` | `services/services.{ts,html,scss,spec.ts}`, class `Services` |
| Service | `npx ng g s core/services/seo --type=service` | `seo.service.ts`, class `SeoService` |

Services keep the `.service.ts` suffix. The v22 CLI generates `@Service()`, which is auto-provided
at root. Keep it rather than `@Injectable({ providedIn })`. Replace the generated "should create"
spec with tests of what the component actually does.

Run Prettier **only on files you wrote**, never on a folder: re-wrapping text inside an
already-translated template changes its extracted source (see Languages).

## Code rules

- Standalone only, no `NgModule`. Don't add zone.js or `ChangeDetectionStrategy.Eager`.
- `inject()` in field initializers; never constructor injection.
- State: `signal()`, `computed()`, `linkedSignal()`. Component API: `input()`, `input.required()`,
  `output()`, `model()`. No decorators for inputs/outputs, no `BehaviorSubject` for component state.
- Templates: `@if`, `@for` (always `track`), `@switch`, `@defer`, `@let`. No `*ngIf`/`*ngFor`/
  `ngClass`/`ngStyle`; use `[class.x]`/`[style.x]`. Recursion (the org chart) uses
  `<ng-template>` with `[ngTemplateOutlet]`.
- Host bindings in `host: {}`, not `@HostBinding`/`@HostListener`.
- Forms: **Signal Forms** (`@angular/forms/signals`) with `[formField]`. No reactive forms.
- Images: `NgOptimizedImage` (`ngSrc`, width/height; `priority` only on the LCP image). Filenames
  kebab-case, no spaces.
- Prerender safety: anything touching `window`, `document`, timers or observers runs in
  `afterNextRender()` or is browser-guarded.
- Route params arrive as `input()`s (`withComponentInputBinding()`); query params too
  (`Contact.topic` from `?topic=`).

## Languages (phase 8)

- **Angular i18n** (`@angular/localize`), compile time: one `npm run build` produces a Khmer build
  at the root (`subPath: ""`) and an English one under `/en/` (`subPath: "en"`), each with its own
  `<base href>`, `lang` and JS. Templates are written in **English, the source language**; Khmer
  is the translation in `src/locale/messages.km.xlf`. URL slugs are English in both.
- `ng serve` and tests show the English source (`local` has `localize: false`);
  `ng serve --configuration local-km` previews Khmer.
- **Every visible string is marked**: `i18n="@@area.name"` on elements, `i18n-<attr>` on
  attributes (alt, aria-label, and static inputs like `heading`), `` $localize`:@@area.name:Text` `` in
  TypeScript (route titles and descriptions, nav labels, form errors, content files). Always use a
  readable custom id. Add a translator note as `i18n="Note for the reviewer@@id"`.
- Don't share an id between sources formatted differently (template text on its own lines vs.
  TypeScript or a one-line attribute): leading and trailing whitespace differs and extraction
  warns "Duplicate messages". Give each place its own id.
- **Workflow**: after changing text, run `npm run i18n`. It extracts the English, then
  `tools/i18n-merge.mjs` updates the Khmer file: keeps translations, marks ones whose English
  changed as `needs-review-translation` (whitespace-only changes don't count), drops removed ids
  and **lists ids with no Khmer**. To translate, add
  `<trans-unit id="…"><target state="…">ខ្មែរ</target></trans-unit>` and run `npm run i18n` again;
  it fills in the English and sorts the file. It also writes `dist/i18n/review.html` for the
  reviewer. Placeholders (`<x id="INTERPOLATION" …/>`, `START_LINK`, `LINE_BREAK`) must appear in
  the target exactly as in the source.
- A string with no Khmer **fails the production build** (`i18nMissingTranslation: "error"`). The
  merge script leaves untranslated units out of the file on purpose: Angular silently shows
  English for a unit that exists without a `<target>`.
- Target states: `final` = the client's own Khmer, used as given; `needs-review-translation` =
  drafted by the developer, waiting for a native speaker; `translated` = reviewed. Never mark a
  draft `final`.
- Khmer copy: Khmer numerals in running text (៧០០, ៦), like the client's text. Placeholder copy
  keeps the word "placeholder" so it stays recognisable. People's names stay in Latin script, as
  on the client's chart, until the client says otherwise.
- Links that include the language: build them with `Location.prepareExternalUrl()` (skip link,
  canonical); a bare `/path` or `#main` resolves to the Khmer site. For the other language use
  `languagePath()` from `core/i18n/languages.ts`, which must match `subPath` in angular.json.
- `rg-language-switch` sits in the header, outside the drawer. It's a plain `<a href>`, not
  `routerLink`: the other language is a separate build. It names each language in itself
  (ខ្មែរ, English) with `lang` and `hreflang`, and keeps the query string.
- Khmer typography: `:lang(km)` sets line height 1.8. CSS counters use
  `counter(step, khmer)` under `:lang(km)`. Never letter-space Khmer.

## Layout, navigation and SEO

- Navigation data lives once in `core/layout/navigation.ts` (`MAIN_NAV`, `LEGAL_NAV`, labels via
  `$localize`); header and footer both render from it. Add pages there, not in templates.
- The menu is flat today (About us, Services, Organisation, Contact us). `rg-nav-menu` still
  supports groups with the **disclosure pattern** (button + `aria-expanded` + list of links, not
  `role="menu"`), which the user chose; its spec tests that with its own `entries` input.
- `rg-mobile-drawer` wraps the single `rg-nav-menu`: inline from `$md`, modal side panel below
  it, with `@angular/cdk`'s focus trap. Its TS breakpoint (`COMPACT_QUERY`) must match `$md`.
- SEO is route-driven: each route has a `title` and `data: { description }` (both `$localize`),
  plus `noindex: true` or `jsonLd` where needed. `SeoTitleStrategy` calls `SeoService.apply`,
  which writes the title (`Page | SITE_NAME`), description, robots, canonical, `hreflang`
  alternates (km, en, x-default = Khmer; none on noindex pages), Open Graph with `og:locale`, and
  JSON-LD. Absolute URLs use `environment.site_url` (**a placeholder, `https://www.example.com`,
  until the client's domain is known**).
- JSON-LD (`ORGANIZATION_JSON_LD`, home only) holds **confirmed facts only**: it's invisible, so a
  placeholder can't be marked as one. Name, legal name, the client's Khmer name, url, logo and
  description; add address, phone, email, founding date and social profiles only when confirmed.
- Links to an in-page target can't be bare `href="#x"` (base href). Use `routerLink` +
  `[fragment]` (anchor scrolling is on) or a button that focuses the target.

## Pages and content

- Content pages wrap in `<div class="container page">` and open with
  `<header class="page-header"><h1>…</h1><p class="lead">…</p></header>`. Full-width bands
  (`rg-quote-cta`) go after that div. Global helpers in `_base.scss`: `.page`, `.page-header`,
  `.prose`, `.stack`, `.lead`, `.section`, `.section--mist`, `.button` (+ `--secondary`,
  `--on-dark`), `.visually-hidden`.
- **Copy comes from the client.** The company text on Home, About and Services is the client's
  own Khmer (with an English translation); don't add claims they haven't made. For example the
  process has three steps and no "delivery": their text says trucks are loaded for customers.
- Shared UI: `rg-section-heading` (h2/h3 + intro + optional link), `rg-process-steps` (numbered
  steps from `ContentService.process`, titles only or with text), `rg-quote-cta` (band linking
  to `/contact-us?topic=quote`), `rg-external-link` (always use it for off-site links).
- Organisation: `content/organisation.ts` lists people with `reportsTo` ids;
  `ContentService.orgChart` nests each under their first manager, and the page names any
  second manager in text. Names and titles only: **no photos** until each person agrees.
- Contact form: Signal Forms with `[formRoot]`/`[formField]`, an error summary of buttons that
  call `focusBoundControl()`, `aria-invalid`/`aria-describedby` per field. Topics: general,
  quote, partnerships. Sending goes through the `CONTACT_SENDER` token, which **rejects by
  default** until the client picks a service; its origin must then go into the CSP.
- Placeholders stay visibly marked: the hero photo (`images/placeholders/`), the contact address
  and details, the legal pages.
- `/404` is a real route in each language; nginx serves the one matching the URL's language.
- Dates: pass ISO date strings (`2026-03-14`) to `DatePipe` without a timezone argument.

## Build output, headers and CI

- **Build with `npm run build`**, never `npx ng build` alone: npm's `postbuild` hook runs
  `tools/postbuild.mjs` on both languages' pages. It's safe to re-run.
- It writes each page's **Content-Security-Policy `<meta>`** with SHA-256 hashes of that page's
  inline scripts (Angular's event-replay contract and per-page bootstrap). `security.autoCsp`
  **can't be used**: the builder throws when prerendering is on. It also swaps the critical-CSS
  `onload="this.media='all'"` for one hashed listener.
- CSP rules for new code: no inline event handlers or hand-written inline scripts in
  `index.html`; the build fails on handlers. `script-src` never gets `'unsafe-inline'`;
  `style-src` has it (prerendered `<style>` blocks and `style=""`). The policy allows only the
  site's own origin; any new origin (form service, API, embed) goes in `POLICY` in
  `tools/postbuild.mjs`, and an embed also needs its grant in `Permissions-Policy`.
- It writes **sitemap.xml** (every page with no `noindex` and a canonical pointing at itself, each
  with its `hreflang` alternates) and **robots.txt**; the origin comes from the home page's
  canonical. It **fails the build** if an indexable page's canonical isn't its own URL, or its
  alternates don't include itself, point at a missing page, or disagree with their pair.
- nginx: shared headers in `security-headers.conf` (nosniff, referrer, `frame-ancestors`,
  `X-Frame-Options`, `Permissions-Policy`). Every `location` that calls `add_header` must also
  `include security-headers.conf;`, and headers on 4xx responses need `always`. A `map` picks the
  404 page by language. `/404`, `/en/404` and the `index.csr.html` shells return 404. Hashed
  JS/CSS and `/fonts/*.woff2` are immutable for a year: fonts aren't hashed, so replacing one
  means renaming it.
- CI (`.github/workflows/ci.yml`): pull requests to `main` run `npm ci`, lint, test and
  `npm run build` on Node 22 (same as the Dockerfile).

## Styles

- Tokens are CSS custom properties in `_tokens.scss` (colors `--c-*`, `--font-*`, `--fs-*`,
  `--space-1..10`, grid). Components use `var(--token)`; they **don't** `@use 'tokens'`.
- Brand colours come from the client's organisation chart: `--c-brand` #03321e (header, hero,
  headings, links, buttons) and `--c-accent` #e9a41c (the logo's gold), **only on `--c-brand`**
  (6.6:1 there, 2.1:1 on white). `--c-error` and `--c-success` are for form feedback only.
- Typefaces: Noto Serif Display with Noto Serif Khmer for headings, Kantumruy Pro (Latin and
  Khmer) for body text, all self-hosted.
- For media queries, `@use 'breakpoints' as bp;` then `@include bp.up(bp.$md) { … }`.
- No drop shadows or rounded cards. Separate with `--c-mist` bands and `var(--border)` rules.
  No motion; anything added later stops under `prefers-reduced-motion`.
- Component style budget: 4 kB warning, 8 kB error.

## Accessibility bar

Landmarks, one h1 per page, skip link, `aria-expanded` disclosure buttons, Escape closes,
meaningful alt text (translated), visible focus, WCAG AA, works from 360px, no duplicated
mobile/desktop markup, `lang` correct on every page and on text in the other language. External
links: `target="_blank"`, `rel="noopener noreferrer"` and a visible or screen-reader "opens in a
new tab" cue.

## Before calling work done

```bash
npm run i18n          # after changing any text: extract, merge, list missing Khmer
npm run build         # both languages + prerender + postbuild (CSP, sitemap, robots, checks)
npx ng lint
npx ng test --watch=false
```

For anything touching nginx, the CSP, URLs or the language switch, also build the image
(`docker build -t web-view .`), run it and check pages **in both languages** in a browser: CSP
violations and wrong-language links show up only there.
