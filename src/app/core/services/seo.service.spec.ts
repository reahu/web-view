import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { SITE_NAME, SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let meta: Meta;
  let title: Title;
  let document: Document;

  const content = (selector: string) => meta.getTag(selector)?.getAttribute('content');
  const canonical = () =>
    document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
    title = TestBed.inject(Title);
    document = TestBed.inject(DOCUMENT);
  });

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

  it('marks pages noindex on request', () => {
    service.apply({ title: 'Page not found', path: '/nope', noindex: true });
    expect(content('name="robots"')).toBe('noindex');
    service.apply({ title: 'Media', path: '/media' });
    expect(content('name="robots"')).toBe('index, follow');
  });
});
