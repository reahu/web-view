import { TranslationKey } from '@core/i18n/translations';

/** One stage of the company's work, from dredging to loading trucks. */
export interface ProcessStep {
  /** Stable key, used for tracking. */
  id: string;
  title: TranslationKey;
  text: TranslationKey;
}
