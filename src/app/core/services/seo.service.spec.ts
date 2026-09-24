import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { ORGANIZATION_JSON_LD, SITE_NAME, SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let meta: Meta;
  let title: Title;
  let document: Document;

  const content = (selector: string) => meta.getTag(selector)?.getAttribute('content');
  const canonical = () =>
    document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');

  const setup = (baseHref: string) => {
    TestBed.configureTestingModule({ providers: [{ provide: APP_BASE_HREF, useValue: baseHref }] });
    service = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
    title = TestBed.inject(Title);
    document = TestBed.inject(DOCUMENT);
  };

  beforeEach(() => setup('/'));

  it('suffixes page titles with the site name', () => {
    service.apply({ title: 'Investors', path: '/investors' });
    expect(title.getTitle()).toBe(`Investors | ${SITE_NAME}`);
    expect(content('property="og:title"')).toBe(`Investors | ${SITE_NAME}`);
  });

  it('uses the bare site name for the home page', () => {
    service.apply({ title: SITE_NAME, path: '/' });
    expect(title.getTitle()).toBe(SITE_NAME);
    expect(canonical()).toBe(`${environment.site_url}/`);
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
    expect(canonical()).toBe(`${environment.site_url}/media`);
    expect(content('property="og:url"')).toBe(`${environment.site_url}/media`);
  });

  it('prefixes page URLs with the language base href, without a trailing slash', () => {
    TestBed.resetTestingModule();
    setup('/en/');
    service.apply({ path: '/csr' });
    expect(canonical()).toBe(`${environment.site_url}/en/csr`);
    service.apply({ path: '/' });
    expect(canonical()).toBe(`${environment.site_url}/en`);
    expect(content('property="og:url"')).toBe(`${environment.site_url}/en`);
  });

  it('marks pages noindex on request', () => {
    service.apply({ title: 'Page not found', path: '/nope', noindex: true });
    expect(content('name="robots"')).toBe('noindex');
    service.apply({ title: 'Media', path: '/media' });
    expect(content('name="robots"')).toBe('index, follow');
  });

  describe('JSON-LD', () => {
    const scripts = () => document.head.querySelectorAll('script[type="application/ld+json"]');

    it('writes one block and removes it on pages without structured data', () => {
      service.apply({ path: '/', jsonLd: ORGANIZATION_JSON_LD });
      service.apply({ path: '/', jsonLd: ORGANIZATION_JSON_LD });
      expect(scripts().length).toBe(1);
      expect(JSON.parse(scripts()[0].textContent ?? '')).toEqual(ORGANIZATION_JSON_LD);

      service.apply({ title: 'Media', path: '/media' });
      expect(scripts().length).toBe(0);
    });

    it('cannot be closed early by a value containing </script>', () => {
      service.apply({ path: '/', jsonLd: { name: '</script><script>alert(1)</script>' } });
      expect(scripts()[0].textContent).not.toContain('</script>');
      expect(JSON.parse(scripts()[0].textContent ?? '').name).toBe('</script><script>alert(1)</script>');
    });

    it('describes the organisation at the site origin', () => {
      expect(ORGANIZATION_JSON_LD).toMatchObject({
        '@type': 'Organization',
        name: SITE_NAME,
        url: `${environment.site_url}/`,
      });
    });
  });
});
