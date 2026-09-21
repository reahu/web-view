import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { News } from './news';

describe('News', () => {
  it('lists all news, newest first, with h2 cards under the page h1', async () => {
    await TestBed.configureTestingModule({
      imports: [News],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(News);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const dates = [...el.querySelectorAll('rg-news-card time')].map((t) => t.getAttribute('datetime'));
    expect(dates).toEqual(TestBed.inject(ContentService).news().map((n) => n.date));
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelectorAll('rg-news-card h2').length).toBe(dates.length);
  });
});
