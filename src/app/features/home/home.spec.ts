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

  it('has exactly one h1, the company name', () => {
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent).toContain('Malin Koh Kong Peace Development');
  });

  it('summarises the process with titles only and links to the services page', () => {
    expect(el.querySelectorAll('rg-process-steps li').length).toBe(3);
    expect(el.querySelector('rg-process-steps .step__text')).toBeNull();
    const hrefs = [...el.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/services');
    expect(hrefs).toContain('/about');
    expect(hrefs).toContain('/contact-us?topic=quote');
  });

  it('marks the hero photo as a placeholder', () => {
    expect(el.querySelector('.hero__image')?.getAttribute('alt')).toMatch(/^Placeholder/);
  });
});
