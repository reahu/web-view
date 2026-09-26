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
| `npm run deploy:staging` | Staging build deployed to Cloudflare, on workers.dev (run `npx wrangler login` once first) |

## Deployment

Cloudflare Workers static assets ([wrangler.jsonc](wrangler.jsonc)). Staging is the Worker `malin-web-staging` on workers.dev. Production waits for the .com.kh domain.

Cloudflare builds from GitHub (Workers Builds): every push to `main` deploys staging, and other branches get a preview. The Worker's build settings in the Cloudflare dashboard:

| Setting | Value |
|---|---|
| Build command | `npm run build -- --configuration staging && node tools/cloudflare.mjs` |
| Deploy command | `npx wrangler deploy --env staging` |
| Preview command | `npx wrangler preview --env staging` |
| Production branch | `main` |

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
