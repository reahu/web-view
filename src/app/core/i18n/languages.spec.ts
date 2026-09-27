import { LANGUAGES, languageByCode, languageOfUrl, languagePath, pagePath } from './languages';

const [khmer, english, chinese] = LANGUAGES;

describe('languages', () => {
  it('puts Khmer first, at the root', () => {
    expect(khmer.code).toBe('km');
    expect(khmer.prefix).toBe('');
    expect(english.prefix).toBe('/en');
    expect(chinese.prefix).toBe('/zh');
  });

  it('finds a language by its code', () => {
    expect(languageByCode('zh-Hans')).toBe(chinese);
    expect(languageByCode('fr')).toBeUndefined();
    expect(languageByCode(null)).toBeUndefined();
  });

  it('reads the language from the URL prefix, Khmer at the root', () => {
    expect(languageOfUrl('/en/about')).toBe(english);
    expect(languageOfUrl('/en')).toBe(english);
    expect(languageOfUrl('/en?topic=quote')).toBe(english);
    expect(languageOfUrl('zh/contact-us')).toBe(chinese);
    expect(languageOfUrl('/about')).toBe(khmer);
    expect(languageOfUrl('')).toBe(khmer);
    expect(languageOfUrl('/english')).toBe(khmer);
  });

  it('strips the language prefix from a URL', () => {
    expect(pagePath('/en/about?x=1')).toBe('/about?x=1');
    expect(pagePath('/en')).toBe('/');
    expect(pagePath('/zh?x=1')).toBe('/?x=1');
    expect(pagePath('/about')).toBe('/about');
    expect(pagePath('')).toBe('/');
  });

  it('builds page URLs without a trailing slash', () => {
    expect(languagePath(khmer, '/')).toBe('/');
    expect(languagePath(english, '/')).toBe('/en');
    expect(languagePath(chinese, '/')).toBe('/zh');
    expect(languagePath(khmer, '/about')).toBe('/about');
    expect(languagePath(english, '/about')).toBe('/en/about');
    expect(languagePath(chinese, '/about')).toBe('/zh/about');
  });

  it('keeps the query string and drops the fragment', () => {
    expect(languagePath(english, '/contact-us?topic=quote#main')).toBe('/en/contact-us?topic=quote');
    expect(languagePath(khmer, '/?x=1')).toBe('/?x=1');
  });
});
