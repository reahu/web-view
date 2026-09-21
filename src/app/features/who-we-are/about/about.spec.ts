import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SECTORS } from '@core/models/company';
import { About } from './about';

describe('About', () => {
  it('has one h1 and links each sector to the portfolio', async () => {
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(About);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    const sectorLinks = [...el.querySelectorAll('.prose a')].map((a) => a.getAttribute('href'));
    expect(sectorLinks).toEqual(SECTORS.map((id) => `/business-portfolio#${id}`));
  });
});
