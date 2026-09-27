# web-view

Angular 22 · standalone · zoneless · signals · Vitest.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Dev server with the `local` configuration |
| `npm run build -- --configuration <local\|dev\|staging\|production>` | Build (default `production`) |
| `npm test` | Unit tests (Vitest) |
| `docker build --build-arg configuration=staging -t web-view .` | Container image served by nginx |
| `npm run preview:staging` | Staging build served locally by Wrangler (http://localhost:8787), with Cloudflare's routing and headers |
| `npm run deploy:staging` | Staging build deployed to Cloudflare from your machine (run `npx wrangler login` once first). Normally a push to `main` does this |
| `npm run i18n` | Checks the translations and writes a review page per language to `dist/i18n/review.<code>.html` |

## Translations

[ngx-translate](https://ngx-translate.org) with one JSON file per language in [src/i18n](src/i18n): `en.json`, `km.json`, `zh-Hans.json`. Keys are flat (`"about.title": "About us"`).

- **Use a string:** `{{ 'about.title' | translate }}`, with values as `{{ 'footer.copyright' | translate: { year } }}` for `"© {{year}} …"`. Import `TranslatePipe` from `@core/i18n/translate-pipe`: it only accepts keys that are in `en.json`, so a typo fails the build. In TypeScript, type a key as `TranslationKey`.
- **Add a string:** add the key to every file. `en.json` is the source; `npm run build` refuses to run until every language has the same keys, `{{placeholders}}` and links (`tools/i18n-check.mjs`).
- **A link inside a sentence:** mark it in each translation, `"… please <a>contact us</a>."`, and render it with `<rg-linked-text [text]="'legal.contact' | translate" path="/contact-us" />`.
- **Internal links:** `[routerLink]="'/about' | langPath"`, which adds the page's language prefix.
- **Review state:** [src/i18n/review.json](src/i18n/review.json) lists, per language, the strings that are the client's own text and the ones a native speaker has approved; the rest are drafts. It also holds notes for translators. `npm run i18n` shows all of this on the review pages. When English text changes, take its key out of those lists.

Every page is prerendered in every language, in one build: Khmer at `/`, English under `/en`, Chinese under `/zh` ([app.routes.ts](src/app/app.routes.ts)). The URL decides the language, and the language switch changes it in place, without reloading. `npm start` serves all three.

## Deployment

GitHub → Cloudflare: the site is hosted on Cloudflare Workers static assets ([wrangler.jsonc](wrangler.jsonc)), and Cloudflare builds it from this repository by itself (Workers Builds). Deploys need no GitHub Actions workflow or API token; [ci.yml](.github/workflows/ci.yml) only checks pull requests.

- A push to `main` deploys staging, the Worker `malin-web-staging`: https://malin-web-staging.reahu-seak.workers.dev (noindex).
- A push to any other branch builds a Preview with its own URL, linked from the pull request.
- Production waits for the .com.kh domain.

The Worker was created from this repository in the Cloudflare dashboard (**Workers & Pages → Create → Import a repository**, GitHub, `reahu/web-view`) with these settings, which can be changed later under its **Settings → Build**:

| Setting | Value |
|---|---|
| Project name | `malin-web-staging` (must match the Worker that `--env staging` deploys) |
| Git branch | `main` |
| Build command | `npm run build -- --configuration staging && node tools/cloudflare.mjs` |
| Deploy command | `npx wrangler deploy --env staging` |
| Preview command | `npx wrangler preview --env staging` |
| Root directory | empty (the repository root) |

Cloudflare's build image uses Node 24, which Angular 22 supports.

## Project structure

Code is organized by **feature area**, not by file type ([Angular style guide](https://angular.dev/style-guide)).

```
src/
  app/
    app.ts · app.html · app.scss · app.config.ts · app.routes.ts
    core/          app-wide singletons, provided once from app.config.ts
      auth/        auth state, functional guards
      http/        functional interceptors, API helpers
      config/      runtime/app configuration tokens
    layout/        app shell: container, left menu, not-found page
    features/      one folder per lazy-loaded feature, each with its own <name>.routes.ts
    shared/        reusable, feature-agnostic code
      ui/          standalone components, directives, pipes
      models/      shared types (datatables/, enums/, responses/)
      utils/       pure helper functions
  environments/    environment.{,dev.,staging.,prod.}ts — swapped via fileReplacements
  styles/          global SCSS (styles.scss, _variables.scss)
public/            static files served from the site root (/imgs, /i18n, /fonts, /excels)
```

### Import aliases

`@core/*`, `@layout/*`, `@features/*`, `@shared/*`, `@env/*` (see `tsconfig.json`).

### Conventions

- Standalone only; no NgModules. File names without type suffix (`user-list.ts`, class `UserList`).
- Zoneless change detection; components are `OnPush` by default.
- `inject()` instead of constructor injection; signals (`signal`, `computed`, `input()`, `output()`) for state.
- Built-in control flow (`@if`, `@for`, `@switch`) in templates.
- Functional guards and interceptors (`CanActivateFn`, `HttpInterceptorFn`).
- Features are lazy-loaded: `{ path: 'x', loadChildren: () => import('@features/x/x.routes') }`.
- Anything under `core/` or `shared/` must not import from `features/`.
