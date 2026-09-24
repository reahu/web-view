// Brings src/locale/messages.km.xlf in line with the English strings that
// `ng extract-i18n` wrote to dist/i18n/messages.xlf. Run both with `npm run i18n`.
//
// To translate a string, add `<trans-unit id="…"><target state="…">ខ្មែរ</target></trans-unit>`
// to messages.km.xlf and run `npm run i18n`; it fills in the English source and sorts the file.
//
// - Khmer targets are kept. If a string's English source changed, its target is marked
//   state="needs-review-translation" so the reviewer sees it.
// - Strings with no Khmer yet are listed and left out of the file: Angular silently falls back
//   to English for a unit without a <target>, but a missing unit fails the production build
//   (i18nMissingTranslation: error).
// - Strings no longer in the app are dropped and listed.
//
// Target states used in this project (XLIFF 1.2):
//   final                     the client's own Khmer text, used as given
//   needs-review-translation  drafted by the developer, waiting for a native speaker
//   translated                reviewed and approved

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const EXTRACTED = join(ROOT, 'dist', 'i18n', 'messages.xlf');
const KHMER = join(ROOT, 'src', 'locale', 'messages.km.xlf');

const english = parse(await readFile(EXTRACTED, 'utf8'));
const khmer = parse(await readFile(KHMER, 'utf8').catch(() => ''));

const missing = [];
const changed = [];
const units = [...english.values()]
  .sort((a, b) => a.id.localeCompare(b.id))
  .map((unit) => {
    const existing = khmer.get(unit.id);
    if (!existing?.target) {
      missing.push(unit.id);
      return undefined;
    }
    // A unit added by hand (id and target only) gets its source filled in here. Whitespace
    // doesn't count: reformatting a template re-wraps text without changing it.
    if (existing.source && normalise(existing.source) !== normalise(unit.source)) {
      changed.push(unit.id);
      return { ...unit, target: existing.target, state: 'needs-review-translation' };
    }
    return { ...unit, target: existing.target, state: existing.state };
  })
  .filter((unit) => unit !== undefined);
const obsolete = [...khmer.keys()].filter((id) => !english.has(id));

await writeFile(
  KHMER,
  [
    '<?xml version="1.0" encoding="UTF-8" ?>',
    '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
    '  <file source-language="en" target-language="km" datatype="plaintext" original="ng2.template">',
    '    <body>',
    ...units.map(serialize),
    '    </body>',
    '  </file>',
    '</xliff>',
    '',
  ].join('\n'),
);

report('no Khmer yet (the production build fails until these are translated)', missing);
report('English changed, Khmer marked for review', changed);
report('removed, no longer in the app', obsolete);
console.log(`i18n: ${units.length} strings in ${KHMER.slice(ROOT.length + 1)}`);

function normalise(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function parse(xml) {
  const units = new Map();
  for (const [, id, body] of xml.matchAll(/<trans-unit id="([^"]+)"[^>]*>([\s\S]*?)<\/trans-unit>/g)) {
    const target = body.match(/<target(?:\s+state="([^"]*)")?\s*>([\s\S]*?)<\/target>/);
    units.set(id, {
      id,
      source: body.match(/<source>([\s\S]*?)<\/source>/)?.[1] ?? '',
      target: target?.[2],
      state: target?.[1],
      notes: [...body.matchAll(/<note\b[^>]*>[\s\S]*?<\/note>/g)].map(([note]) => note),
      // File names only: line numbers would change the file on every template edit.
      files: [...new Set([...body.matchAll(/context-type="sourcefile">([^<]*)</g)].map(([, f]) => f))],
    });
  }
  return units;
}

function serialize({ id, source, target, state, notes, files }) {
  return [
    `      <trans-unit id="${id}" datatype="html">`,
    `        <source>${source}</source>`,
    `        <target state="${state ?? 'needs-review-translation'}">${target}</target>`,
    ...notes.map((note) => `        ${note}`),
    ...files.map(
      (file) =>
        `        <context-group purpose="location"><context context-type="sourcefile">${file}</context></context-group>`,
    ),
    '      </trans-unit>',
  ].join('\n');
}

function report(label, ids) {
  if (ids.length) {
    console.log(`i18n: ${ids.length} ${label}:\n${ids.map((id) => `  - ${id}`).join('\n')}`);
  }
}
