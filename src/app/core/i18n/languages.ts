export interface Language {
  code: 'km' | 'en';
  /** The language's name in itself: the switch's text for screen readers. Never translated. */
  label: string;
  /** Before the page path in URLs. Must match the locale's subPath in angular.json. */
  prefix: string;
  ogLocale: string;
}

/** Khmer at the root, English under /en. The first is the default (x-default). */
export const LANGUAGES: readonly Language[] = [
  { code: 'km', label: 'ខ្មែរ', prefix: '', ogLocale: 'km_KH' },
  { code: 'en', label: 'English', prefix: '/en', ogLocale: 'en_US' },
];

/**
 * The language of this build. LOCALE_ID is 'km' or 'en' in localized builds and 'en-US' in
 * `ng serve` and tests, which show the English source text.
 */
export function languageFor(localeId: string): Language {
  const code = localeId.split('-', 1)[0];
  return LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[1];
}

/**
 * Root-relative URL of a page in a language, from its path inside the app ('/about').
 * No trailing slash, so the English home page is '/en'. Query strings are kept.
 */
export function languagePath(language: Language, path: string): string {
  const [page, query] = splitQuery(path.split('#', 1)[0] || '/');
  const url = page === '/' ? language.prefix || '/' : language.prefix + page;
  return query ? `${url}?${query}` : url;
}

function splitQuery(path: string): [string, string | undefined] {
  const index = path.indexOf('?');
  return index === -1 ? [path, undefined] : [path.slice(0, index) || '/', path.slice(index + 1)];
}
