import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SECTORS } from '@core/models/company';
import { AboutIntro } from './about-intro';

describe('AboutIntro', () => {
  it('links every sector to its section of the portfolio page', async () => {
    await TestBed.configureTestingModule({
      imports: [AboutIntro],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(AboutIntro);
    await fixture.whenStable();

    const hrefs = [...(fixture.nativeElement as HTMLElement).querySelectorAll('.sectors a')].map(
      (a) => a.getAttribute('href'),
    );
    expect(hrefs).toEqual(SECTORS.map((id) => `/business-portfolio#${id}`));
  });
});
