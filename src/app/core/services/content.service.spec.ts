import { TestBed } from '@angular/core/testing';
import { ContentService } from './content.service';

describe('ContentService', () => {
  it('lists the process steps in order, each with a title and text', () => {
    const steps = TestBed.inject(ContentService).process();
    expect(steps.map((step) => step.id)).toEqual(['dredging', 'depot', 'loading']);
    for (const step of steps) {
      expect(step.title).toBeTruthy();
      expect(step.text).toBeTruthy();
    }
  });
});
