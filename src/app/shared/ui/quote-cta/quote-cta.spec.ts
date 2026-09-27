import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { QuoteCta } from './quote-cta';

describe('QuoteCta', () => {
  it('links to the contact page', async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteCta],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(QuoteCta);
    await fixture.whenStable();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.getAttribute('href')).toBe('/en/contact-us');
  });
});
