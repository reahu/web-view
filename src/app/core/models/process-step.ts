import { TranslationKey } from '@core/i18n/translations';

/** One stage of the company's sand supply, from dredging to delivery. */
export interface ProcessStep {
  /** Stable key, used for tracking. */
  id: string;
  title: TranslationKey;
  text: TranslationKey;
}
