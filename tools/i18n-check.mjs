// Checks the translations in src/i18n before every build (npm's prebuild hook) and with
// `npm run i18n`. Node built-ins only; changes nothing.
//
// en.json is the source: its keys are the ones the code may use, which the TypeScript
// compiler checks (TranslationKey). Every other language must have exactly those keys, each
// with some text, the same {{placeholders}} and the same <a>…</a> link (see LinkedText).
// Without this a missing string would show its key on the page, as ngx-translate falls back
// to the key.
//
// review.json may only name keys that exist, in languages that exist.

import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = join(import.meta.dirname, '..', 'src', 'i18n');

const files = (await readdir(DIR)).filter(
  (name) => name.endsWith('.json') && name !== 'review.json',
);
const languages = Object.fromEntries(
  await Promise.all(
    files.map(async (name) => [name.slice(0, -'.json'.length), await readJson(join(DIR, name))]),
  ),
);
const english = languages.en;
if (!english) {
  fail(['src/i18n/en.json is missing']);
}

const problems = [];
for (const [code, strings] of Object.entries(languages)) {
  for (const [key, text] of Object.entries(strings)) {
    if (typeof text !== 'string' || !text.trim()) {
      problems.push(`${code}.json: ${key} has no text`);
    } else if (text !== text.trim()) {
      problems.push(
        `${code}.json: ${key} starts or ends with a space; put spacing in the template`,
      );
    }
    if (code !== 'en' && !(key in english)) {
      problems.push(`${code}.json: ${key} isn't in en.json (a typo, or no longer used?)`);
    }
  }
  if (code === 'en') {
    continue;
  }
  for (const [key, source] of Object.entries(english)) {
    const text = strings[key];
    if (text === undefined) {
      problems.push(`${code}.json: ${key} is missing (English: "${source}")`);
    } else if (typeof text === 'string' && markup(text) !== markup(source)) {
      problems.push(
        `${code}.json: ${key} must keep ${markup(source) || 'no placeholders or links'}, has ${markup(text) || 'none'}`,
      );
    }
  }
}

const review = await readJson(join(DIR, 'review.json'));
for (const key of Object.keys(review.notes ?? {})) {
  if (!(key in english)) {
    problems.push(`review.json: a note for ${key}, which isn't in en.json`);
  }
}
for (const [code, lists] of Object.entries(review)) {
  if (code === 'notes') {
    continue;
  }
  if (!languages[code] || code === 'en') {
    problems.push(`review.json: "${code}" isn't a translation in src/i18n`);
    continue;
  }
  for (const [list, keys] of Object.entries(lists)) {
    for (const key of keys.filter((key) => !(key in english))) {
      problems.push(`review.json: ${code}.${list} lists ${key}, which isn't in en.json`);
    }
  }
}

if (problems.length) {
  fail(problems);
}
console.log(
  `i18n: ${Object.keys(english).length} strings, all in ${Object.keys(languages).sort().join(', ')}`,
);

/** The placeholders and link in a string, in a fixed order, e.g. "{{year}} <a>…</a>". */
function markup(text) {
  const placeholders = [...text.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map(([, name]) => `{{${name}}}`);
  const links = [...text.matchAll(/<(\/?)a>/g)].map(([, close]) => (close ? '</a>' : '<a>'));
  return [...placeholders.sort(), ...links].join(' ').replace(/<a> <\/a>/g, '<a>…</a>');
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    fail([`${path}: ${error.message}`]);
  }
}

function fail(messages) {
  console.error(
    `i18n: ${messages.length} problem(s) in src/i18n:\n${messages.map((m) => `  - ${m}`).join('\n')}`,
  );
  process.exit(1);
}
