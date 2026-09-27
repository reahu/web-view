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

  it('asks for a consultation, not a quote for sand', () => {
    expect(el.querySelector('rg-quote-cta h2')?.textContent?.trim()).toBe(
      'Planning a mining project?',
    );
    expect(el.querySelector('rg-quote-cta a')?.textContent?.trim()).toBe('Request a consultation');
  });
});
