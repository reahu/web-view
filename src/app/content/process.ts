import { ProcessStep } from '@core/models/process-step';

// Each step's text is part of the client's own description of their sand business (their
// Khmer is the original; see src/i18n/km.json). Don't add claims the client hasn't made,
// or make their figures exact: the barge holds "about" 700 m³ and its crew is "about" six.
export const PROCESS: readonly ProcessStep[] = [
  {
    id: 'dredging',
    title: 'process.dredging.title',
    text: 'process.dredging.text',
  },
  {
    id: 'depot',
    title: 'process.depot.title',
    text: 'process.depot.text',
  },
  {
    id: 'delivery',
    title: 'process.delivery.title',
    text: 'process.delivery.text',
  },
];
