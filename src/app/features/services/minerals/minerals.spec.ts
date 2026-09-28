import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Minerals } from './minerals';

describe('Minerals', () => {
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Minerals],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Minerals);
    await fixture.whenStable();
    el = fixture.nativeElement;
  });

  it('has one h1 and the client’s headline as its lead', () => {
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('.lead')?.textContent).toContain(
      'mineral exploration, mining licensing and regulatory coordination',
    );
  });

  it('lists the application steps in order, then the licences it handles', () => {
    const steps = [...el.querySelectorAll('ol.steps li')].map((li) => li.textContent?.trim());
    expect(steps.length).toBe(8);
    expect(steps[0]).toBe('Initial consultation');
    expect(steps[7]).toContain('Ministry of Mines and Energy');
    expect(el.querySelectorAll('ul.licences li').length).toBe(6);
  });

  it('shows a sample being dug and minerals being separated on video', () => {
    expect(
      [...el.querySelectorAll('.clips source')].map((source) => source.getAttribute('src')),
    ).toEqual(['/videos/minerals-sample.mp4', '/videos/minerals-table.mp4']);
  });

  it('shows photos of exploration work after the videos, each described', () => {
    const photos = [...el.querySelectorAll<HTMLImageElement>('.photo-row img')];
    expect(photos.map((img) => img.getAttribute('src'))).toEqual([
      '/images/photos/minerals-fieldwork.webp',
      '/images/photos/minerals-outcrop.webp',
      '/images/photos/minerals-drilling.webp',
      '/images/photos/minerals-panning.webp',
    ]);
    expect(photos.every((img) => img.alt.length > 0)).toBe(true);
    const clips = el.querySelector('.clips')!;
    const row = el.querySelector('.photo-row')!;
    expect(clips.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('asks for a consultation, not a quote for sand', () => {
    expect(el.querySelector('rg-quote-cta h2')?.textContent?.trim()).toBe(
      'Planning a mining project?',
    );
    expect(el.querySelector('rg-quote-cta a')?.textContent?.trim()).toBe('Request a consultation');
  });
});
