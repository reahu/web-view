// Prepares the build in dist/web-view/browser for Cloudflare Workers static assets
// (wrangler.jsonc), doing there what nginx.conf does for the Docker image. Run it after
// `npm run build`, which includes postbuild. Node built-ins only. Safe to run more than once on
// the same output.
//
// 1. 404 pages: Cloudflare serves the nearest 404.html with a 404 status (not_found_handling),
//    so each language's prerendered 404 page moves from 404/index.html to 404.html (Khmer at
//    the root, English in en/). The URLs /404 and /en/404 then show that page with a 200
//    status, where nginx sends a 404; the page is noindex, so that's harmless.
// 2. _headers: the headers in security-headers.conf on every response, and the year-long cache
//    nginx gives hashed build output and fonts. HTML needs no rule: Cloudflare's default,
//    max-age=0 with must-revalidate, has the same effect as nginx's no-cache.
// 3. .assetsignore: keeps the client-side shells (index.csr.html) out of the upload, as nginx
//    refuses to serve them; no page links to them.

import { readFile, rename, rmdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist', 'web-view');
const BROWSER = join(DIST, 'browser');

/** Same as nginx.conf gives .js, .css and .woff2. */
const IMMUTABLE = 'public, max-age=31536000, immutable';

const routes = Object.keys(
  JSON.parse(await readFile(join(DIST, 'prerendered-routes.json'), 'utf8')).routes,
);
const notFoundRoutes = routes.filter((route) => route.split('/').at(-1) === '404');
if (!notFoundRoutes.length) {
  fail('no prerendered /404 route, so there is no 404 page to serve');
}
for (const route of notFoundRoutes) {
  const folder = join(BROWSER, ...route.split('/').filter(Boolean));
  if (await exists(join(folder, 'index.html'))) {
    await rename(join(folder, 'index.html'), `${folder}.html`);
    await rmdir(folder);
  } else if (!(await exists(`${folder}.html`))) {
    fail(`${route} has no prerendered page`);
  }
}
console.log(`cloudflare: 404.html for ${notFoundRoutes.join(', ')}`);

const securityHeaders = [
  ...(await readFile(join(ROOT, 'security-headers.conf'), 'utf8')).matchAll(
    /^add_header\s+([\w-]+)\s+"([^"]*)"/gm,
  ),
].map(([, name, value]) => `  ${name}: ${value}`);
if (!securityHeaders.length) {
  fail('security-headers.conf has no add_header lines');
}
await writeFile(
  join(BROWSER, '_headers'),
  [
    '/*',
    ...securityHeaders,
    ...['js', 'css', 'woff2'].flatMap((extension) => [
      `/*.${extension}`,
      `  Cache-Control: ${IMMUTABLE}`,
    ]),
    '',
  ].join('\n'),
);
console.log(`cloudflare: _headers (${securityHeaders.length} security headers)`);

await writeFile(join(BROWSER, '.assetsignore'), 'index.csr.html\n');
console.log('cloudflare: .assetsignore');

async function exists(path) {
  return stat(path).then(
    () => true,
    () => false,
  );
}

function fail(message) {
  console.error(`cloudflare: ${message}`);
  process.exit(1);
}
