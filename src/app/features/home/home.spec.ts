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

  it('summarises the process with titles only and links to the services page', () => {
    expect(el.querySelectorAll('rg-process-steps li').length).toBe(3);
    expect(el.querySelector('rg-process-steps .step__text')).toBeNull();
    const hrefs = [...el.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/en/services');
    expect(hrefs).toContain('/en/contact-us');
  });

  it('shows the hall photo, no longer a placeholder', () => {
    const image = el.querySelector('.hero__image');
    expect(image?.getAttribute('src')).toContain('/images/photos/hall.webp');
    expect(image?.getAttribute('alt')).not.toMatch(/^Placeholder/);
  });
});
