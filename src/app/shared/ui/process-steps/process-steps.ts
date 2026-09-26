import { Component, input } from '@angular/core';
import { ProcessStep } from '@core/models/process-step';

/**
 * The company's process as a numbered list: titles only for a summary, or with each
 * step's text. Numbers come from CSS counters, in Khmer numerals on Khmer pages.
 */
@Component({
  selector: 'rg-process-steps',
  styleUrl: './process-steps.scss',
  templateUrl: './process-steps.html',
})
export class ProcessSteps {
  readonly steps = input.required<readonly ProcessStep[]>();
  readonly showText = input(true);
}
