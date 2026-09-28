import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Sand } from './sand';

describe('Sand', () => {
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sand],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Sand);
    await fixture.whenStable();
    el = fixture.nativeElement;
  });

  it('has one h1 and every process step with its text', () => {
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('Sand dredging, supply and transport');
    expect(el.querySelectorAll('.step').length).toBe(3);
    expect(el.querySelectorAll('.step__text').length).toBe(3);
  });

  it('shows the dredging barges on video', () => {
    const video = el.querySelector('rg-video-loop video');
    expect(video?.querySelector('source')?.getAttribute('src')).toBe('/videos/sand-dredgers.mp4');
    expect(video?.getAttribute('aria-label')).toBe(
      'Sand-dredging barges moored beside a sand depot',
    );
  });

  it('shows photos of the barge, each described for screen readers', () => {
    const photos = [...el.querySelectorAll<HTMLImageElement>('.photo-row img')];
    expect(photos.map((img) => img.getAttribute('src'))).toEqual([
      '/images/photos/sand-bank.webp',
      '/images/photos/sand-deck.webp',
      '/images/photos/sand-moored.webp',
    ]);
    expect(photos.map((img) => img.alt)).toEqual([
      'A sand-dredging barge moored along the riverbank',
      'The wheelhouse and pump engines on a barge’s deck',
      'A barge and a small boat moored on open water',
    ]);
  });

  it('asks for a quote for sand', () => {
    expect(el.querySelector('rg-quote-cta h2')?.textContent?.trim()).toBe(
      'Need sand for your project?',
    );
    expect(el.querySelector('rg-quote-cta a')?.textContent?.trim()).toBe('Request a quote');
  });
});
