// Writes dist/i18n/review.<code>.html for each translation in src/i18n: every translated
// string beside its English, grouped by where it appears, with its review state from
// review.json and any translator note. For the native speakers who check the translations.
// Run with `npm run i18n` (after the check), or on its own.
//
// review.json lists, per language, the keys whose text is the client's own ("client") and
// those a native speaker has approved ("reviewed"); every other string is a draft. When a
// string's English changes, take its key out of those lists so it's checked again.

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const DIR = join(ROOT, 'src', 'i18n');

/** Each language's name in English, for the page's text, and in itself, for its column. */
const LANGUAGES = {
  km: { name: 'Khmer', label: 'ខ្មែរ' },
  'zh-Hans': { name: 'Chinese', label: '简体中文' },
};

/** Page groups by key prefix, in site order. */
const GROUPS = [
  ['Every page: header, menu and footer', ['site', 'layout', 'nav', 'footer', 'link', 'seo']],
  ['Home', ['home']],
  ['Company description (Home and About)', ['company']],
  ['About', ['about']],
  ['Services and how the company works', ['services', 'process', 'cta']],
  ['Organisation chart', ['organisation', 'org']],
  ['Contact form', ['contact']],
  ['Privacy policy and terms of use', ['legal', 'privacy', 'terms']],
  ['Page not found', ['notFound']],
  ['Browser tab titles and search-result descriptions', ['route']],
];

const STATES = {
  draft: { key: 'draft', label: 'Draft · please check' },
  client: { key: 'client', label: 'Client’s own text' },
  reviewed: { key: 'reviewed', label: 'Reviewed' },
};

const readJson = async (name) => JSON.parse(await readFile(join(DIR, name), 'utf8'));
const english = await readJson('en.json');
const review = await readJson('review.json');
const codes = (await readdir(DIR))
  .filter((name) => name.endsWith('.json') && !['en.json', 'review.json'].includes(name))
  .map((name) => name.slice(0, -'.json'.length));

await mkdir(join(ROOT, 'dist', 'i18n'), { recursive: true });
for (const locale of codes) {
  if (!LANGUAGES[locale]) {
    console.error(`i18n: add ${locale} to LANGUAGES in tools/i18n-review.mjs`);
    process.exit(1);
  }
  const strings = await readJson(`${locale}.json`);
  const lists = review[locale] ?? {};
  const units = Object.entries(english).map(([id, source]) => ({
    id,
    source,
    target: strings[id] ?? '',
    state: lists.client?.includes(id)
      ? STATES.client
      : lists.reviewed?.includes(id)
        ? STATES.reviewed
        : STATES.draft,
    notes: review.notes?.[id] ? [review.notes[id]] : [],
  }));
  const out = join(ROOT, 'dist', 'i18n', `review.${locale}.html`);
  await writeFile(out, page({ locale, ...LANGUAGES[locale] }, units));
  console.log(`i18n: ${locale}: review page for ${units.length} strings at ${out.slice(ROOT.length + 1)}`);
}

function groupsOf(units) {
  return [...GROUPS, ['Other', []]]
    .map(([title, prefixes]) => ({
      title,
      units: units.filter((unit) => {
        const prefix = unit.id.split('.', 1)[0];
        return title === 'Other'
          ? !GROUPS.some(([, known]) => known.includes(prefix))
          : prefixes.includes(prefix);
      }),
    }))
    .filter((group) => group.units.length);
}

function escapeHtml(text) {
  return text.replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`);
}

/** {{placeholders}} and the <a>…</a> link, shown as tags the reviewer must keep. */
function withPlaceholders(text) {
  return escapeHtml(text)
    .replace(/&#60;a&#62;/g, '<span class="ph">⟨link⟩</span>')
    .replace(/&#60;\/a&#62;/g, '<span class="ph">⟨/link⟩</span>')
    .replace(/\{\{\s*(\w+)\s*\}\}/g, '<span class="ph">⟨$1⟩</span>');
}

function row(language, unit) {
  return `
      <article class="row" data-state="${unit.state.key}">
        <div class="row__meta">
          <span class="chip chip--${unit.state.key}">${unit.state.label}</span>
          <code>${unit.id}</code>
        </div>
        <div class="row__text">
          <span class="row__label">English</span>
          <p lang="en">${withPlaceholders(unit.source)}</p>
        </div>
        <div class="row__text">
          <span class="row__label row__label--target" lang="${language.locale}">${language.label}</span>
          <p class="row__target" lang="${language.locale}">${withPlaceholders(unit.target)}</p>
        </div>${unit.notes.map((note) => `\n        <p class="row__note">Note: ${escapeHtml(note)}</p>`).join('')}
      </article>`;
}

function page(language, units) {
  const count = (key) => units.filter((unit) => unit.state.key === key).length;
  return `<title>Malin ${language.name} Review</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600&family=Noto+Serif+Display:wght@600&display=swap">
<style>
  :root {
    --bg: #f5f7f5;
    --surface: #ffffff;
    --ink: #14181f;
    --muted: #56615a;
    --line: #d5dbd6;
    --brand: #03321e;
    --client-bg: #e2efe6;
    --client-ink: #1e6b3a;
    --draft-bg: #fbefd6;
    --draft-ink: #7a4a00;
    --reviewed-bg: #e5ebf4;
    --reviewed-ink: #274a7a;
    --ph-bg: #e8ebe9;
    --focus: #03321e;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      color-scheme: dark;
      --bg: #0f1613;
      --surface: #16201b;
      --ink: #e6ece8;
      --muted: #a1aea6;
      --line: #2b3831;
      --brand: #8fd1a8;
      --client-bg: #1c3526;
      --client-ink: #9fdcb5;
      --draft-bg: #3a2b0f;
      --draft-ink: #f1c46b;
      --reviewed-bg: #1c293c;
      --reviewed-ink: #a9c4ec;
      --ph-bg: #26332c;
      --focus: #8fd1a8;
    }
  }
  :root[data-theme="dark"] {
    color-scheme: dark;
    --bg: #0f1613;
    --surface: #16201b;
    --ink: #e6ece8;
    --muted: #a1aea6;
    --line: #2b3831;
    --brand: #8fd1a8;
    --client-bg: #1c3526;
    --client-ink: #9fdcb5;
    --draft-bg: #3a2b0f;
    --draft-ink: #f1c46b;
    --reviewed-bg: #1c293c;
    --reviewed-ink: #a9c4ec;
    --ph-bg: #26332c;
    --focus: #8fd1a8;
  }

  body {
    background: var(--bg);
    color: var(--ink);
    font: 16px/1.6 'Kantumruy Pro', 'Khmer UI', 'Leelawadee UI', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  }
  .wrap {
    max-width: 72rem;
    margin: 0 auto;
    padding-inline: 16px;
    padding-block: 32px 64px;
    display: grid;
    gap: 40px;
  }
  h1, h2 {
    margin: 0;
    color: var(--brand);
    font-family: 'Noto Serif Display', Georgia, serif;
    font-weight: 600;
    line-height: 1.15;
    text-wrap: balance;
  }
  h1 { font-size: clamp(1.9rem, 4vw, 2.6rem); }
  h2 { font-size: 1.35rem; }
  p { margin: 0; }
  .row__target { line-height: 1.85; }
  code { font: 0.8125rem/1.4 ui-monospace, 'Cascadia Mono', Consolas, monospace; color: var(--muted); overflow-wrap: anywhere; }
  :focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }

  .intro { display: grid; gap: 16px; max-width: 65ch; }
  .intro__lead { color: var(--muted); font-size: 1.0625rem; }
  .howto { margin: 0; padding-left: 1.25rem; display: grid; gap: 6px; }

  .filters { display: flex; flex-wrap: wrap; gap: 8px; }
  .filter {
    display: inline-flex; align-items: center; gap: 8px;
    min-height: 44px; padding: 0 14px;
    border: 1px solid var(--line); border-radius: 2px;
    background: var(--surface); color: var(--ink);
    font: inherit; font-size: 0.9375rem; cursor: pointer;
  }
  .filter[aria-pressed="true"] { border-color: var(--brand); box-shadow: inset 0 0 0 1px var(--brand); font-weight: 600; }
  .filter b { font-variant-numeric: tabular-nums; }

  .group { display: grid; gap: 12px; }
  .rows { display: grid; gap: 1px; background: var(--line); border: 1px solid var(--line); }
  .row {
    display: grid; gap: 8px 24px;
    padding: 16px;
    background: var(--surface);
  }
  @media (min-width: 52rem) {
    .row { grid-template-columns: 13rem 1fr 1fr; align-items: start; }
    .row__note { grid-column: 2 / -1; }
  }
  .row__meta { display: grid; gap: 6px; justify-items: start; }
  .row__text { display: grid; gap: 2px; min-width: 0; }
  .row__label { color: var(--muted); font-size: 0.75rem; letter-spacing: 0.04em; text-transform: uppercase; }
  /* Letter-spacing pulls Khmer subscript consonants apart. */
  .row__label--target { letter-spacing: 0; }
  .row__note { color: var(--muted); font-size: 0.875rem; }

  .chip { padding: 2px 8px; border-radius: 2px; font-size: 0.8125rem; font-weight: 600; white-space: nowrap; }
  .chip--client { background: var(--client-bg); color: var(--client-ink); }
  .chip--draft { background: var(--draft-bg); color: var(--draft-ink); }
  .chip--reviewed { background: var(--reviewed-bg); color: var(--reviewed-ink); }
  .ph { padding: 0 4px; border-radius: 2px; background: var(--ph-bg); color: var(--muted); font-size: 0.8125rem; white-space: nowrap; }
</style>

<main class="wrap">
  <header class="intro">
    <h1>Malin ${language.name} Review</h1>
    <p class="intro__lead">
      Every ${language.name} text on the Malin Koh Kong Peace Development website, beside the
      English it was written from. ${units.length} strings: ${count('draft')} drafts to check,
      ${count('client')} taken from the client’s own ${language.name}, ${count('reviewed')} already reviewed.
    </p>
    <ol class="howto">
      <li>Read each <strong>draft</strong>: is the ${language.name} correct and natural for a company website?</li>
      <li><strong>Client’s own text</strong> is Malin’s ${language.name}, used as given. Flag it only if something looks wrong.</li>
      <li>Keep the grey tags such as ⟨link⟩ and ⟨year⟩ in place: the website fills them in.</li>
      <li>Words marked “placeholder” are temporary and will be replaced with real details.</li>
      <li>Send corrections with the string’s code (for example <code>contact.title</code>) so the developer can find it.</li>
    </ol>
  </header>

  <div class="filters" role="group" aria-label="Show">
    <button type="button" class="filter" data-filter="all" aria-pressed="true">All <b>${units.length}</b></button>
    <button type="button" class="filter" data-filter="draft" aria-pressed="false">Drafts to check <b>${count('draft')}</b></button>
    <button type="button" class="filter" data-filter="client" aria-pressed="false">Client’s own text <b>${count('client')}</b></button>
    <button type="button" class="filter" data-filter="reviewed" aria-pressed="false">Reviewed <b>${count('reviewed')}</b></button>
  </div>
${groupsOf(units)
  .map(
    (group, index) => `
  <section class="group" aria-labelledby="group-${index}">
    <h2 id="group-${index}">${group.title}</h2>
    <div class="rows">${group.units.map((unit) => row(language, unit)).join('')}
    </div>
  </section>`,
  )
  .join('\n')}
</main>

<script>
  const buttons = [...document.querySelectorAll('.filter')];
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
      for (const row of document.querySelectorAll('.row')) {
        row.hidden = filter !== 'all' && row.dataset.state !== filter;
      }
      for (const group of document.querySelectorAll('.group')) {
        group.hidden = !group.querySelector('.row:not([hidden])');
      }
    });
  }
</script>
`;
}
