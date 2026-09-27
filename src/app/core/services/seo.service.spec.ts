import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { LanguageService } from '@core/i18n/language.service';
import { LANGUAGES } from '@core/i18n/languages';
import { environment } from '@env/environment';
import { SITE_INDEXABLE, SeoService, organizationJsonLd } from './seo.service';

const SITE_NAME = 'Malin Koh Kong Peace Development';
const [khmer] = LANGUAGES;

describe('SeoService', () => {
  let service: SeoService;
  let meta: Meta;
  let title: Title;
  let document: Document;

  const content = (selector: string) => meta.getTag(selector)?.getAttribute('content');
  const canonical = () =>
    document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');

  // Tests describe the production site; local builds aren't indexable (see the last test).
  // Pages are in English, as in every test (src/test-providers.ts).
  const setup = (indexable = true) => {
    TestBed.configureTestingModule({
      providers: [{ provide: SITE_INDEXABLE, useValue: indexable }],
    });
    service = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
    title = TestBed.inject(Title);
    document = TestBed.inject(DOCUMENT);
  };

  beforeEach(() => setup());

  it('suffixes page titles with the site name', () => {
    service.apply({ title: 'Investors', path: '/investors' });
    expect(title.getTitle()).toBe(`Investors | ${SITE_NAME}`);
    expect(content('property="og:title"')).toBe(`Investors | ${SITE_NAME}`);
  });

  it('uses the bare site name for the home page', () => {
    service.apply({ title: SITE_NAME, path: '/' });
    expect(title.getTitle()).toBe(SITE_NAME);
    expect(canonical()).toBe(`${environment.site_url}/en`);
  });

  it('writes the description, falling back to a default', () => {
    service.apply({ title: 'CSR', description: 'Our programmes.', path: '/csr' });
    expect(content('name="description"')).toBe('Our programmes.');

    service.apply({ title: 'Media', path: '/media' });
    expect(content('name="description"')).toBeTruthy();
    expect(content('name="description"')).not.toBe('Our programmes.');
  });

  it('keeps a single canonical link without query or fragment', () => {
    service.apply({ path: '/csr?x=1#main' });
    service.apply({ path: '/media#main' });
    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
    expect(canonical()).toBe(`${environment.site_url}/en/media`);
    expect(content('property="og:url"')).toBe(`${environment.site_url}/en/media`);
  });

  it('prefixes page URLs with the language, without a trailing slash', async () => {
    service.apply({ path: '/csr' });
    expect(canonical()).toBe(`${environment.site_url}/en/csr`);
    service.apply({ path: '/' });
    expect(canonical()).toBe(`${environment.site_url}/en`);
    expect(content('property="og:url"')).toBe(`${environment.site_url}/en`);

    await TestBed.inject(LanguageService).use(khmer);
    service.apply({ path: '/csr' });
    expect(canonical()).toBe(`${environment.site_url}/csr`);
    service.apply({ path: '/' });
    expect(canonical()).toBe(`${environment.site_url}/`);
  });

  it('writes the site name, default description and locale in the page language', async () => {
    await TestBed.inject(LanguageService).use(khmer);
    service.apply({ path: '/' });
    expect(title.getTitle()).toBe('ម៉ាលីន កោះកុង ភីស ឌីវេឡុបមិន');
    expect(content('property="og:site_name"')).toBe('ម៉ាលីន កោះកុង ភីស ឌីវេឡុបមិន');
    expect(content('name="description"')).toContain('ផ្គត់ផ្គង់ខ្សាច់');
    expect(content('property="og:locale"')).toBe('km_KH');
  });

  it('marks pages noindex on request', () => {
    service.apply({ title: 'Page not found', path: '/nope', noindex: true });
    expect(content('name="robots"')).toBe('noindex');
    service.apply({ title: 'Media', path: '/media' });
    expect(content('name="robots"')).toBe('index, follow');
  });

  it('uses the share card as the default social image, with its size', () => {
    service.apply({ path: '/' });
    expect(content('property="og:image"')).toBe(`${environment.site_url}/images/share/malin-share.webp`);
    expect(content('property="og:image:width"')).toBe('1200');
    expect(content('property="og:image:height"')).toBe('630');
    expect(content('property="og:image:alt"')).toBeTruthy();

    service.apply({ path: '/about', image: '/images/about.webp' });
    expect(content('property="og:image"')).toBe(`${environment.site_url}/images/about.webp`);
    expect(meta.getTag('property="og:image:width"')).toBeNull();
  });

  describe('language alternates', () => {
    const alternates = () =>
      Object.fromEntries(
        [...document.head.querySelectorAll('link[rel="alternate"][hreflang]')].map((link) => [
          link.getAttribute('hreflang'),
          link.getAttribute('href'),
        ]),
      );

    it('links every language and x-default (Khmer), without query or fragment', () => {
      service.apply({ path: '/services?x=1#main' });
      expect(alternates()).toEqual({
        km: `${environment.site_url}/services`,
        en: `${environment.site_url}/en/services`,
        'zh-Hans': `${environment.site_url}/zh/services`,
        'x-default': `${environment.site_url}/services`,
      });
      service.apply({ path: '/' });
      expect(alternates()).toEqual({
        km: `${environment.site_url}/`,
        en: `${environment.site_url}/en`,
        'zh-Hans': `${environment.site_url}/zh`,
        'x-default': `${environment.site_url}/`,
      });
    });

    it('leaves them off noindex pages', () => {
      service.apply({ path: '/services' });
      service.apply({ path: '/nope', noindex: true });
      expect(alternates()).toEqual({});
    });

    it('sets og:locale for the page language (English in tests)', () => {
      service.apply({ path: '/' });
      expect(content('property="og:locale"')).toBe('en_US');
    });
  });

  describe('JSON-LD', () => {
    const scripts = () => document.head.querySelectorAll('script[type="application/ld+json"]');

    it('writes one block and removes it on pages without structured data', () => {
      const organization = organizationJsonLd(service.translate);
      service.apply({ path: '/', jsonLd: organization });
      service.apply({ path: '/', jsonLd: organization });
      expect(scripts().length).toBe(1);
      expect(JSON.parse(scripts()[0].textContent ?? '')).toEqual(organization);

      service.apply({ title: 'Media', path: '/media' });
      expect(scripts().length).toBe(0);
    });

    it('cannot be closed early by a value containing </script>', () => {
      service.apply({ path: '/', jsonLd: { name: '</script><script>alert(1)</script>' } });
      expect(scripts()[0].textContent).not.toContain('</script>');
      expect(JSON.parse(scripts()[0].textContent ?? '').name).toBe('</script><script>alert(1)</script>');
    });

    it('describes the organisation at the site origin, in the page language', () => {
      expect(organizationJsonLd(service.translate)).toMatchObject({
        '@type': 'Organization',
        name: SITE_NAME,
        url: `${environment.site_url}/`,
        description: expect.stringContaining('supplies sand'),
      });
    });
  });

  it('marks every page noindex, without alternates, on builds that are not indexable', () => {
    TestBed.resetTestingModule();
    setup(false);
    service.apply({ title: 'Services', path: '/services' });
    expect(content('name="robots"')).toBe('noindex');
    expect(document.head.querySelector('link[rel="alternate"][hreflang]')).toBeNull();
    expect(canonical()).toBe(`${environment.site_url}/en/services`);
  });
});
