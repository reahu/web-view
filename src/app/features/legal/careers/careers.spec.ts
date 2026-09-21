import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Careers } from './careers';

describe('Careers', () => {
  it('has exactly one h1', async () => {
    await TestBed.configureTestingModule({
      imports: [Careers],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Careers);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('a.button')?.getAttribute('href')).toBe('/contact-us?topic=careers');
  });
});
