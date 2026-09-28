import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { About } from './about';

describe('About', () => {
  it('has one h1 and lists the four values', async () => {
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(About);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(
      [...el.querySelectorAll('.values__list li')].map((li) => li.textContent?.trim()),
    ).toEqual(['Quality', 'Trust', 'Efficiency', 'Strong partnership']);
  });

  it('shows a photo of each business, sand first, each described', async () => {
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(About);
    await fixture.whenStable();
    const photos = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLImageElement>(
        '.photo-row img',
      ),
    ];

    expect(photos.map((img) => img.getAttribute('src'))).toEqual([
      '/images/photos/sand-bow.webp',
      '/images/photos/minerals-survey.webp',
    ]);
    expect(photos.map((img) => img.alt)).toEqual([
      'The bow of a sand-dredging barge, with its pumps and suction hose',
      'A team inspecting a site for mineral exploration',
    ]);
  });
});
