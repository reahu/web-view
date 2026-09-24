import { Service, Signal, signal } from '@angular/core';
import { PROCESS } from '@content/process';
import { ProcessStep } from '@core/models/process-step';

/**
 * The only way components read site content. Everything is exposed as signals so the
 * static arrays in src/app/content can later be swapped for httpResource() calls
 * without touching any component.
 */
@Service()
export class ContentService {
  /** The company's work, in order: dredging, pumping to the depot, loading trucks. */
  readonly process: Signal<readonly ProcessStep[]> = signal(PROCESS).asReadonly();
}
