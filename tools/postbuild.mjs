// Runs after `npm run build` (npm's postbuild hook) on the prerendered output in
// dist/web-view/browser. Node built-ins only.
//
// - sitemap.xml: every prerendered route whose page is indexable and canonical to itself.
//   /404 (noindex) and /social (a redirect stub with no canonical) drop out by that rule.
// - robots.txt: allows everything and points to the sitemap.
//
// The site origin is read from the home page's canonical link, which SeoService writes from
// environment.site_url, so the sitemap always matches the canonicals of the build it ships with.

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '..', 'dist', 'web-view');
const BROWSER = join(DIST, 'browser');

const routes = Object.keys(
  JSON.parse(await readFile(join(DIST, 'prerendered-routes.json'), 'utf8')).routes,
).sort();

const pages = await Promise.all(
  routes.map(async (route) => ({ route, head: headOf(await readFile(pageFile(route), 'utf8')) })),
);

const home = pages.find((page) => page.route === '/');
const homeCanonical = home && canonicalOf(home.head);
if (!homeCanonical) {
  fail('the home page has no <link rel="canonical">, so the site origin is unknown');
}
const origin = new URL(homeCanonical).origin;

const included = [];
for (const { route, head } of pages) {
  const url = origin + route;
  const canonical = canonicalOf(head);
  if (/\bnoindex\b/.test(robotsOf(head) ?? '')) {
    console.log(`postbuild: sitemap skips ${route} (noindex)`);
  } else if (canonical !== url) {
    console.log(`postbuild: sitemap skips ${route} (canonical is ${canonical ?? 'missing'})`);
  } else {
    included.push(url);
  }
}

await writeFile(
  join(BROWSER, 'sitemap.xml'),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...included.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n'),
);
await writeFile(
  join(BROWSER, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
);
console.log(`postbuild: sitemap.xml (${included.length} URLs) and robots.txt for ${origin}`);

function pageFile(route) {
  return join(BROWSER, ...route.split('/').filter(Boolean), 'index.html');
}

function headOf(html) {
  return html.slice(0, html.indexOf('</head>'));
}

function canonicalOf(head) {
  return tags(head, 'link').find((attrs) => attrs.rel === 'canonical')?.href;
}

function robotsOf(head) {
  return tags(head, 'meta').find((attrs) => attrs.name === 'robots')?.content;
}

/** Attributes of every <name …> tag in the markup. Enough for Angular's own output. */
function tags(markup, name) {
  return [...markup.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))].map(([, attrs]) =>
    Object.fromEntries(
      [...attrs.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), value]),
    ),
  );
}

function escapeXml(text) {
  return text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function fail(message) {
  console.error(`postbuild: ${message}`);
  process.exit(1);
}
