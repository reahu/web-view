---
name: web-view-angular
description: Project conventions for the web-view Angular 22 app (standalone, zoneless, signals, feature-based folders). Use this skill whenever you add or change anything under web-view/src — a new feature/page/screen, route, component, service, API call, guard, interceptor, pipe, directive, model/interface/enum, form, table, layout/menu item, environment value, or global style — even if the user just says "add a page for X", "call the API for Y", "make a list of Z" or "create a model" without mentioning Angular or the folder structure.
---

# web-view Angular conventions

This app is Angular 22.1 with TypeScript 6.0, standalone components only, **zoneless** change
detection and **OnPush** by default. No UI/i18n/state libraries are installed. Don't add npm
packages unless the user explicitly asks, because the dependency list was deliberately kept to
the CLI defaults.

Reading this skill before touching code keeps new work consistent with a skeleton that was set
up on purpose. The folders exist but are mostly empty, so don't infer conventions from
whatever happens to be there. Use this skill instead.

## Where things go

```
src/app/
  app.ts · app.html · app.config.ts · app.routes.ts   root: shell outlet, providers, top-level routes
  core/                 singletons used app-wide, provided once
    auth/               auth state/store, functional guards, login/logout
    http/               functional interceptors (base URL, auth header, errors), API helpers
    config/             InjectionTokens and app-wide config
  layout/               the shell: container, left-menu, header, not-found page
  features/<feature>/   one folder per business area, lazy-loaded
    <feature>.routes.ts
    <page>/             routed page components (smart: inject services, own state)
    <widget>/           feature-private components (presentational)
    <feature>-api.ts    HTTP service for this feature
    <feature>.models.ts types only used by this feature
  shared/               reusable, feature-agnostic, no business rules
    ui/                 standalone components, directives, pipes
    models/             cross-feature types: datatables/, enums/, responses/
    utils/              pure functions (no DI)
src/environments/       environment{,.dev,.staging,.prod}.ts → { production, api_url }
src/styles/             styles.scss (global), _variables.scss (tokens; `@use 'variables'`)
public/                 static files served from the site root: /imgs, /i18n, /fonts, /excels
```

Decision guide, in order:
1. Is it used by only one feature? Put it in `features/<feature>/`. Default here; move it out later if a second feature needs it.
2. Is it a singleton that the whole app depends on (auth, HTTP plumbing, config)? Put it in `core/`.
3. Is it part of the frame around every page? Put it in `layout/`.
4. Is it generic and reused by two or more features? Put it in `shared/`.

Dependency direction: `features → shared, core`. `layout → shared, core`. `core` and
`shared` never import from `features/` or `layout/`. Features don't import from each other.
If two features need the same thing, move it to `shared/`. This keeps lazy chunks
independent and avoids circular imports.

Use the path aliases instead of long relative paths across areas: `@core/*`, `@layout/*`,
`@features/*`, `@shared/*`, `@env/*` (for example `import { environment } from '@env/environment'`).
Relative imports are fine inside the same feature folder.

## Generating files

Prefer `npx ng generate` (from `web-view/`) so file names and boilerplate match the CLI.
Pass the path relative to `src/app`:

| Need | Command | Produces |
|---|---|---|
| Page/component | `npx ng g c features/employees/employee-list` | `employee-list/employee-list.{ts,html,scss,spec.ts}`, class `EmployeeList` |
| Service | `npx ng g s features/employees/employee-api` | `employee-api.ts`, class `EmployeeApi` |
| Guard | `npx ng g guard core/auth/auth --functional` | `auth-guard.ts`, `authGuard` |
| Interceptor | `npx ng g interceptor core/http/api-url` | `api-url-interceptor.ts`, `apiUrlInterceptor` |
| Pipe | `npx ng g pipe shared/ui/khr-currency` | `khr-currency-pipe.ts`, `KhrCurrencyPipe` |
| Directive | `npx ng g directive shared/ui/autofocus` | `autofocus.ts`, `Autofocus` |
| Interface/enum | `npx ng g interface shared/models/responses/api-response` | `api-response.ts` |

Naming follows the Angular 20+ style guide: kebab-case files, **no `.component` or `.service`
suffix**, and the class name matches the file name. Because a service drops its suffix, give it
a name that says what it does (`employee-api`, `auth-store`, `menu-state`) so it doesn't
collide with a model like `Employee`. Always keep the generated `.spec.ts` unless the user says
otherwise.

After generating, rewrite the body to follow the patterns below, because the CLI stubs are
minimal. See `references/patterns.md` for full, compile-checked templates of each kind of file.

## Code rules (and why)

- **Standalone only.** No `NgModule`, no `standalone: true` (it's the default). Import
  dependencies in the component's `imports` array.
- **`inject()`** in field initializers, not constructor parameters. It works in functions
  (guards, interceptors, resolvers) the same way, so there's one DI style.
- **Signals for state.** Use `signal()` for local state, `computed()` for derived state,
  `input()`/`input.required()`/`output()`/`model()` for the component API, and `linkedSignal()`
  for state that resets from an input. Zoneless change detection only re-renders on signal
  changes, template events and `async` pipe emissions. A plain field mutated in a
  `subscribe` callback will **not** update the view.
- **Server data:** in services, return `Observable`s from `HttpClient`. In pages, read them with
  `rxResource()` or `httpResource()` (both give `value()`, `isLoading()` and `error()` signals),
  or with `toSignal()`. Only call `subscribe` for one-off actions like save or delete, and then
  write the result into a signal.
- **Templates:** use `@if`/`@else`, `@for (x of xs(); track x.id)` with `@empty`, `@switch`, and
  `@let`. Don't use `*ngIf`/`*ngFor`/`ngClass`/`ngStyle`. Bind `[class.x]` and `[style.x]`
  instead. Call signals in templates (`items()`).
- **Host bindings** go in the `host: {}` metadata, not `@HostBinding`/`@HostListener`.
- **Guards/interceptors/resolvers are functions** (`CanActivateFn`, `HttpInterceptorFn`,
  `ResolveFn`). Register interceptors in `app.config.ts`:
  `provideHttpClient(withFetch(), withInterceptors([apiUrlInterceptor, ...]))`.
- **Routing:** each feature exports `default` routes from `<feature>.routes.ts`, and
  `app.routes.ts` lazy-loads it with
  `{ path: 'employees', loadChildren: () => import('@features/employees/employees.routes') }`.
  Leaf pages use `loadComponent`. Route params arrive as component `input()`s because
  `withComponentInputBinding()` is enabled.
- **Forms:** use typed reactive forms (`FormBuilder.nonNullable`). Don't use `ngModel` in
  feature code.
- **Types:** strict mode is on. Don't use `any`. Put API response shapes in `shared/models/responses`
  and shared enums in `shared/models/enums`. Prefer `interface` for data shapes. Use
  `as const` objects or TS enums for fixed sets, and match whatever is already in `enums/`.
- **Config:** read the API base from `environment.api_url`, via an interceptor or the service.
  Never hard-code hosts. If you add an environment key, add it to **all four** environment files.
- **Styles:** component styles go in the component's `.scss` (per-component budget: 4 kB
  warning, 8 kB error). Shared tokens go in `src/styles/_variables.scss`, and components pull
  them in with `@use 'variables' as *;` (the `src/styles` load path is configured). Static
  assets are referenced from the root (`/imgs/logo.svg`), not `assets/…`.

## After making changes

Run these from `web-view/` and fix anything they report before calling the work done:

```bash
npx ng build --configuration local        # fast type and template check
npx ng test --watch=false                 # Vitest unit tests
```

When adding a route, also check it loads in `npm start` if you can. Build configurations are
`local`, `dev`, `staging` and `production` (the default for `ng build`). `ng serve` defaults to `local`.
