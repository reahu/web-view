import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    el = fixture.nativeElement;
  });

  it('has exactly one h1, the welcome line with the company name', () => {
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent).toContain(
      'Welcome to Malin Koh Kong Peace Development',
    );
  });

  it('introduces both services and links to each one’s page', () => {
    expect([...el.querySelectorAll('.service h3')].map((h) => h.textContent?.trim())).toEqual([
      'Sand dredging, supply and transport',
      'Mineral exploration and mining licensing',
    ]);
    const hrefs = [...el.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/en/services/sand');
    expect(hrefs).toContain('/en/services/minerals');
    expect(hrefs).toContain('/en/contact-us');
  });

  it('shows each service at work on video', () => {
    expect(
      [...el.querySelectorAll('.service source')].map((source) => source.getAttribute('src')),
    ).toEqual(['/videos/sand-dredgers.mp4', '/videos/minerals-table.mp4']);
  });

  it('opens on the hall photo, then sand and minerals work in turn', () => {
    expect(
      [...el.querySelectorAll('.hero__media img')].map((img) => img.getAttribute('src')),
    ).toEqual([
      '/images/photos/hall.webp',
      '/images/photos/sand-bow.webp',
      '/images/photos/minerals-survey.webp',
      '/images/photos/sand-bank.webp',
      '/images/photos/minerals-drilling.webp',
      '/images/photos/sand-deck.webp',
      '/images/photos/minerals-fieldwork.webp',
      '/images/photos/sand-moored.webp',
      '/images/photos/minerals-outcrop.webp',
      '/images/photos/minerals-panning.webp',
    ]);
    expect(el.querySelector('.hero__media [role="region"]')?.getAttribute('aria-label')).toBe(
      'Photos of our office and our work',
    );
  });
});
