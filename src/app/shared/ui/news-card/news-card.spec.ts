import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NewsItem } from '@core/models/news-item';
import { NewsCard } from './news-card';

const item: NewsItem = {
  id: 'a',
  date: '2026-03-01',
  title: 'Headline',
  excerpt: 'A long excerpt that is never cut in the markup.',
  url: 'https://example.com/a',
  external: true,
};

describe('NewsCard', () => {
  let fixture: ComponentFixture<NewsCard>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsCard);
    el = fixture.nativeElement;
    fixture.componentRef.setInput('item', item);
    await fixture.whenStable();
  });

  it('formats the date and keeps the ISO value machine-readable', () => {
    const time = el.querySelector('time')!;
    expect(time.getAttribute('datetime')).toBe('2026-03-01');
    expect(time.textContent).toBe('1 March 2026');
  });

  it('keeps the full excerpt in the DOM (clamped in CSS only)', () => {
    expect(el.querySelector('.excerpt')?.textContent).toBe(item.excerpt);
  });

  it('marks external links', () => {
    const a = el.querySelector('h3 a')!;
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.textContent).toContain('(opens in a new tab)');
  });

  it('uses a router link for internal items and h2 on request', async () => {
    fixture.componentRef.setInput('item', { ...item, url: '/latest-news', external: false });
    fixture.componentRef.setInput('headingLevel', 2);
    await fixture.whenStable();

    const a = el.querySelector('h2 a')!;
    expect(a.getAttribute('href')).toBe('/latest-news');
    expect(a.hasAttribute('target')).toBe(false);
  });
});
