import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessStep } from '@core/models/process-step';
import { ProcessSteps } from './process-steps';

const STEPS: readonly ProcessStep[] = [
  { id: 'a', title: 'First', text: 'First text' },
  { id: 'b', title: 'Second', text: 'Second text' },
];

describe('ProcessSteps', () => {
  let fixture: ComponentFixture<ProcessSteps>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProcessSteps] }).compileComponents();
    fixture = TestBed.createComponent(ProcessSteps);
    fixture.componentRef.setInput('steps', STEPS);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('renders an ordered list with a heading per step', () => {
    expect(el.querySelector('ol')).not.toBeNull();
    expect([...el.querySelectorAll('li h3')].map((h) => h.textContent?.trim())).toEqual([
      'First',
      'Second',
    ]);
    expect(el.querySelectorAll('.step__text').length).toBe(2);
  });

  it('can show titles only', async () => {
    fixture.componentRef.setInput('showText', false);
    await fixture.whenStable();
    expect(el.querySelectorAll('.step__text').length).toBe(0);
  });
});
