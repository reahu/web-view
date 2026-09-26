import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Services } from './services';

describe('Services', () => {
  it('has one h1 and every process step with its text', async () => {
    await TestBed.configureTestingModule({
      imports: [Services],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Services);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelectorAll('.step').length).toBe(3);
    expect(el.querySelectorAll('.step__text').length).toBe(3);
  });
});
