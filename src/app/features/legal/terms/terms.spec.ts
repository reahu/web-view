import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Terms } from './terms';

describe('Terms', () => {
  it('has exactly one h1', async () => {
    await TestBed.configureTestingModule({
      imports: [Terms],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Terms);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('.notice')?.textContent).toContain('legal');
  });
});
