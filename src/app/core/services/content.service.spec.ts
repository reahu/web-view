import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ContentService } from './content.service';

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sorts news newest first', () => {
    const dates = service.news().map((n) => n.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('sorts milestones oldest first', () => {
    const years = service.milestones().map((m) => m.year);
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it('limits latest news to the requested count', () => {
    expect(service.latestNews(2)().length).toBe(2);
  });

  it('finds a company by slug and follows slug changes', () => {
    const [first, second] = service.companies();
    const slug = signal(first.slug);
    const company = service.companyBySlug(slug);

    expect(company()).toBe(first);
    slug.set(second.slug);
    expect(company()).toBe(second);
    slug.set('does-not-exist');
    expect(company()).toBeUndefined();
  });

  it('puts every company in exactly one sector group', () => {
    const grouped = [...service.companiesBySector().values()].flat();
    expect(grouped.length).toBe(service.companies().length);
  });

  it('uses unique company slugs', () => {
    const slugs = service.companies().map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
