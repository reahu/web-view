import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Csr } from './csr';

describe('Csr', () => {
  it('has exactly one h1', async () => {
    await TestBed.configureTestingModule({
      imports: [Csr],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Csr);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelectorAll('.areas li').length).toBe(4);
  });
});
