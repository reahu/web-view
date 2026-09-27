import { ProcessStep } from '@core/models/process-step';

// Each step's text is one sentence of the client's own description (their Khmer is the
// original; see src/i18n/km.json). Don't add claims the client hasn't made,
// e.g. that the company delivers: the text only says trucks are loaded for customers.
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
    id: 'loading',
    title: 'process.loading.title',
    text: 'process.loading.text',
  },
];
