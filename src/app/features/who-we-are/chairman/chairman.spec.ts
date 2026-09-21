import { TestBed } from '@angular/core/testing';
import { Chairman } from './chairman';

describe('Chairman', () => {
  it('has one h1 and a described portrait', async () => {
    const fixture = TestBed.createComponent(Chairman);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('img')?.getAttribute('alt')).toBeTruthy();
  });
});
