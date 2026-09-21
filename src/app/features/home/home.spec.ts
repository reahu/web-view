import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  it('has exactly one h1 and all four sections', async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    for (const tag of ['rg-hero-carousel', 'rg-about-intro', 'rg-logo-marquee', 'rg-latest-news']) {
      expect(el.querySelector(tag)).not.toBeNull();
    }
  });
});
