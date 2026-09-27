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

  it('asks for a quote for sand', () => {
    expect(el.querySelector('rg-quote-cta h2')?.textContent?.trim()).toBe(
      'Need sand for your project?',
    );
    expect(el.querySelector('rg-quote-cta a')?.textContent?.trim()).toBe('Request a quote');
  });
});
