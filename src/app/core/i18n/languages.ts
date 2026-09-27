export interface Language {
  /** BCP 47 tag, for lang and hreflang. Also the name of its strings file in src/i18n. */
  code: 'km' | 'en' | 'zh-Hans';
  /** The language's name in itself: the switch's menu entry. Never translated. */
  label: string;
  /** The switch button's text while this is the page's language. Never translated. */
  short: string;
  /** Before the page path in URLs; empty for the language at the root. */
  prefix: string;
  ogLocale: string;
}

/** Khmer at the root, the others under their prefix. The first is the default (x-default). */
export const LANGUAGES: readonly Language[] = [
  { code: 'km', label: 'ខ្មែរ', short: 'ខ្មែរ', prefix: '', ogLocale: 'km_KH' },
  { code: 'en', label: 'English', short: 'EN', prefix: '/en', ogLocale: 'en_US' },
  { code: 'zh-Hans', label: '简体中文', short: '中文', prefix: '/zh', ogLocale: 'zh_CN' },
];

export function languageByCode(code: string | null | undefined): Language | undefined {
  return LANGUAGES.find((language) => language.code === code);
}

/**
 * The language of a URL inside the site, from its prefix: '/en/about' is English, '/about'
 * Khmer. Accepts a path without its leading slash, as Location.path() gives for the root ('').
 */
export function languageOfUrl(url: string): Language {
  const first = `/${url.replace(/^\//, '').split(/[/?#]/, 1)[0]}`;
  return LANGUAGES.find((language) => language.prefix === first) ?? LANGUAGES[0];
}

/** A URL inside the site without its language prefix: '/en/about?x=1' is '/about?x=1'. */
export function pagePath(url: string): string {
  const rest = `/${url.replace(/^\//, '')}`.slice(languageOfUrl(url).prefix.length);
  return rest.startsWith('/') ? rest : `/${rest}`;
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
