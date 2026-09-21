import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Privacy } from './privacy';

describe('Privacy', () => {
  it('has exactly one h1', async () => {
    await TestBed.configureTestingModule({
      imports: [Privacy],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Privacy);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('.notice')?.textContent).toContain('legal');
  });
});
