import { TestBed } from '@angular/core/testing';
import { ContentService } from '@core/services/content.service';
import { Milestones } from './milestones';

describe('Milestones', () => {
  it('lists every milestone, oldest first, in an ordered list', async () => {
    const fixture = TestBed.createComponent(Milestones);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const expected = TestBed.inject(ContentService).milestones();
    const years = [...el.querySelectorAll('ol .year')].map((p) => Number(p.textContent));
    expect(years).toEqual(expected.map((m) => m.year));
    expect(el.querySelectorAll('h1').length).toBe(1);
  });
});
