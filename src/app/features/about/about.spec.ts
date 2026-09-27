import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { About } from './about';

describe('About', () => {
  it('has one h1 and lists the four values', async () => {
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(About);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(
      [...el.querySelectorAll('.values__list li')].map((li) => li.textContent?.trim()),
    ).toEqual(['Quality', 'Trust', 'Efficiency', 'Strong partnership']);
  });
});
