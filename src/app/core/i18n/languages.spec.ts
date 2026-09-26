import { LANGUAGES, languageFor, languagePath } from './languages';

const [khmer, english] = LANGUAGES;

describe('languages', () => {
  it('puts Khmer first, at the root', () => {
    expect(khmer.code).toBe('km');
    expect(khmer.prefix).toBe('');
    expect(english.prefix).toBe('/en');
  });

  it('finds the language of the build, treating en-US (dev and tests) as English', () => {
    expect(languageFor('km')).toBe(khmer);
    expect(languageFor('en')).toBe(english);
    expect(languageFor('en-US')).toBe(english);
  });

  it('builds page URLs without a trailing slash', () => {
    expect(languagePath(khmer, '/')).toBe('/');
    expect(languagePath(english, '/')).toBe('/en');
    expect(languagePath(khmer, '/about')).toBe('/about');
    expect(languagePath(english, '/about')).toBe('/en/about');
  });

  it('keeps the query string and drops the fragment', () => {
    expect(languagePath(english, '/contact-us?topic=quote#main')).toBe('/en/contact-us?topic=quote');
    expect(languagePath(khmer, '/?x=1')).toBe('/?x=1');
  });
});
