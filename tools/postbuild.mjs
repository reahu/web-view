// Runs after `npm run build` (npm's postbuild hook) on the prerendered output in
// dist/web-view/browser. Node built-ins only. Safe to run more than once on the same output.
//
// 1. Content-Security-Policy: each prerendered page gets a <meta> policy listing the SHA-256
//    hashes of its own inline scripts. The builder's `security.autoCsp` would do this, but it
//    refuses to run alongside prerendering, and the inline scripts differ per page (the
//    event-replay bootstrap lists that page's events), so no single header could list them.
//    frame-ancestors can't be set from <meta>; nginx sends it (security-headers.conf).
// 2. sitemap.xml: every prerendered route whose page is indexable and canonical to itself,
//    in both languages (Khmer at /, English under /en). noindex pages and redirect stubs (no
//    canonical) drop out; an indexable page whose canonical points elsewhere fails the build.
// 3. robots.txt: allows everything and points to the sitemap.
//
// The site origin is read from the home page's canonical link, which SeoService writes from
// environment.site_url, so the sitemap always matches the canonicals of the build it ships with.

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '..', 'dist', 'web-view');
const BROWSER = join(DIST, 'browser');

/** Everything except script-src, which is built per page. */
const POLICY = {
  'default-src': ["'self'"],
  // Prerendered pages carry component <style> blocks and style="" attributes (NgOptimizedImage
  // `fill`, CSS custom properties); hashing or nonces aren't possible for those in static output.
  'style-src': ["'self'", "'unsafe-inline'"],
  'object-src': ["'none'"],
  // These two don't fall back to default-src.
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

// Critical-CSS inlining loads the full stylesheet with media="print" onload="this.media='all'".
// Inline handlers can't be allowed by hash without 'unsafe-hashes', so, as Angular itself does
// when a CSP nonce is set, the media value moves to an attribute and one listener swaps it in.
// The listener captures on <html> because load events on <link> don't bubble and a listener on
// the link itself isn't reliable in Chrome (angular/angular-cli#26932).
const MEDIA_ATTR = 'data-csp-media';
const MEDIA_SWAP_SCRIPT =
  `(()=>{const r=document.documentElement,f=(e)=>{const l=e.target;` +
  `if(!l||l.tagName!=='LINK'||!l.hasAttribute('${MEDIA_ATTR}'))return;` +
  `l.media=l.getAttribute('${MEDIA_ATTR}');l.removeAttribute('${MEDIA_ATTR}');` +
  `if(!document.querySelector('link[${MEDIA_ATTR}]'))r.removeEventListener('load',f,true)};` +
  `r.addEventListener('load',f,true)})();`;

const routes = Object.keys(
  JSON.parse(await readFile(join(DIST, 'prerendered-routes.json'), 'utf8')).routes,
).sort();

const pages = [];
for (const route of routes) {
  const file = pageFile(route);
  const html = withCsp(await readFile(file, 'utf8'), route);
  await writeFile(file, html);
  pages.push({ route, head: html.slice(0, html.indexOf('</head>')) });
}
console.log(`postbuild: Content-Security-Policy on ${pages.length} pages`);

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
  } else if (!canonical) {
    console.log(`postbuild: sitemap skips ${route} (no canonical: a redirect stub)`);
  } else if (canonical !== url) {
    // e.g. an English page whose canonical lost the /en prefix.
    fail(`${route} has canonical ${canonical}, expected ${url}`);
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

/** Adds (or recomputes) the page's CSP <meta>, right after <meta charset>. */
function withCsp(html, route) {
  html = html.replace(/\n[ \t]*<meta http-equiv="Content-Security-Policy"[^>]*>/gi, '');

  let swapInserted = html.includes(MEDIA_SWAP_SCRIPT);
  html = html.replace(
    /<link\b([^>]*?)\sonload="this\.media='([^']+)'"([^>]*)>/g,
    (_, before, media, after) => {
      const script = swapInserted ? '' : `<script>${MEDIA_SWAP_SCRIPT}</script>`;
      swapInserted = true;
      return `${script}<link${before} ${MEDIA_ATTR}="${media}"${after}>`;
    },
  );

  const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  const handler = markup.match(/<[a-z][^>]*\s(on[a-z]+)=/i);
  if (handler) {
    fail(`${route} has an inline ${handler[1]} handler, which the policy would block`);
  }

  const hashes = new Set(
    [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
      .filter(([, attrs]) => {
        const { src, type } = attributes(attrs);
        return src === undefined && isJavaScript(type);
      })
      .map(([, , body]) => sha256(body)),
  );

  const directives = {
    'default-src': POLICY['default-src'],
    'script-src': ["'self'", ...hashes],
    ...POLICY,
  };
  const policy = Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(' ')}`)
    .join('; ');

  const charset = /<meta charset="[^"]*">/i;
  if (!charset.test(html)) {
    fail(`${route} has no <meta charset>, so there's nowhere to put the policy`);
  }
  return html.replace(
    charset,
    (tag) => `${tag}\n  <meta http-equiv="Content-Security-Policy" content="${policy}">`,
  );
}

function isJavaScript(type) {
  const mime = type?.split(';')[0].trim().toLowerCase();
  return !mime || mime === 'module' || mime === 'text/javascript' || mime === 'application/javascript';
}

/** CSP hash source for an inline script. Browsers hash the parsed text, which has LF endings. */
function sha256(text) {
  const digest = createHash('sha256').update(text.replace(/\r\n?/g, '\n'), 'utf8').digest('base64');
  return `'sha256-${digest}'`;
}

function pageFile(route) {
  return join(BROWSER, ...route.split('/').filter(Boolean), 'index.html');
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
    attributes(attrs),
  );
}

function attributes(source) {
  return Object.fromEntries(
    [...source.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map(([, key, value]) => [
      key.toLowerCase(),
      value ?? '',
    ]),
  );
}

function escapeXml(text) {
  return text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function fail(message) {
  console.error(`postbuild: ${message}`);
  process.exit(1);
}
