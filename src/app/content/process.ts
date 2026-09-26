import { ProcessStep } from '@core/models/process-step';

// Each step's text is one sentence of the client's own description (their Khmer is the
// original; see src/locale/messages.km.xlf). Don't add claims the client hasn't made,
// e.g. that the company delivers: the text only says trucks are loaded for customers.
export const PROCESS: readonly ProcessStep[] = [
  {
    id: 'dredging',
    title: $localize`:@@process.dredging.title:Dredging`,
    text: $localize`:@@process.dredging.text:Our 700 m³ sand-dredging barge is run by skilled operators and a team of six who work to safety standards.`,
  },
  {
    id: 'depot',
    title: $localize`:@@process.depot.title:Pumping to the depot`,
    text: $localize`:@@process.depot.text:Once the barge is loaded, the sand is pumped to the company’s depot.`,
  },
  {
    id: 'loading',
    title: $localize`:@@process.loading.title:Loading trucks`,
    text: $localize`:@@process.loading.text:There, modern excavators prepare the sand and load it onto trucks, so customers are supplied quickly.`,
  },
];
