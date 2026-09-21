import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { LatestNews } from './latest-news';

describe('LatestNews', () => {
  it('shows the three newest items under an h2, as h3 cards', async () => {
    await TestBed.configureTestingModule({
      imports: [LatestNews],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(LatestNews);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const expected = TestBed.inject(ContentService).news().slice(0, 3);
    const titles = [...el.querySelectorAll('rg-news-card h3')].map((h) =>
      h.textContent?.replace(' (opens in a new tab)', '').trim(),
    );
    expect(el.querySelector('h2')?.textContent).toBe('Latest news');
    expect(titles).toEqual(expected.map((n) => n.title));
  });
});
