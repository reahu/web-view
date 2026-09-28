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

GitHub → Cloudflare: the site is hosted on Cloudflare Workers static assets ([wrangler.jsonc](wrangler.jsonc)), and Cloudflare builds it from this repository by itself (Workers Builds). Deploys need no GitHub Actions workflow or API token; [ci.yml](.github/workflows/ci.yml) only checks pull requests. The only Worker code, [worker/index.js](worker/index.js), serves the videos (see [Videos](#videos)).

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

## Videos

Short silent clips that loop while they're on screen, with a pause button: `<rg-video-loop>` ([video-loop.ts](src/app/shared/ui/video-loop/video-loop.ts)) on the home, sand and minerals pages. Each clip is an MP4 in [public/videos](public/videos) with a WebP poster of its first frame beside it, under the same name.

- **Keep them small:** H.264, no sound, about 10 seconds, a few MB. Cloudflare takes at most 25 MiB per file, and the Worker reads each clip whole. Longer videos with sound belong on Cloudflare Stream, not in this repository.
- **Replace a clip** by replacing both files under the same names; Cloudflare revalidates every file, so visitors get the new one. If its size changes, update `[width]` and `[height]` where it's used.
- **The current clips are placeholders**, cut from compressed chat copies (848×464). Recut them from the original files:

| File | Source | From | Length | Fade |
|---|---|---|---|---|
| `sand-dredgers` | `IMG_3154.MP4` (drone) | 0:50 | 12 s | 1.5 s |
| `minerals-table` | `IMG_9469.MP4` | 0:02 | 8 s | 1 s |
| `minerals-sample` | `IMG_5161.MP4` | 0:17 | 9 s | 1 s |

With [ffmpeg](https://ffmpeg.org), the clip's last seconds fade into its first frames, so the loop has no jump. `-t` is the length plus the fade, and `offset` the length minus the fade:

```sh
ffmpeg -ss 50 -t 13.5 -i IMG_3154.MP4 -filter_complex \
  "[0:v]setpts=PTS-STARTPTS,split[a][b];[a]trim=start=1.5,setpts=PTS-STARTPTS[main];[b]trim=end=1.5,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=1.5:offset=10.5,format=yuv420p[v]" \
  -map "[v]" -an -c:v libx264 -profile:v high -crf 26 -preset slow -movflags +faststart sand-dredgers.mp4
ffmpeg -i sand-dredgers.mp4 -frames:v 1 -c:v libwebp -quality 80 sand-dredgers.webp
```

From a full-size original, add `scale=-2:720,` before `format=yuv420p` (`scale=720:-2,` for an upright clip).

**iPhones need byte ranges.** Safari, which every iPhone browser uses, only plays a video from a server that answers a `Range` request with `206 Partial Content`. Cloudflare's static assets send the whole file instead, so [worker/index.js](worker/index.js) answers for `/videos/*` (`run_worker_first` in wrangler.jsonc); every other URL is served as before. nginx handles ranges itself. To check a deploy, `curl -sI -H "Range: bytes=0-1" <site>/videos/sand-dredgers.mp4` should say `206`. The clips start by themselves because [security-headers.conf](security-headers.conf) allows `autoplay=(self)`.

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
