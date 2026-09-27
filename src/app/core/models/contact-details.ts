import { TranslationKey } from '@core/i18n/translations';

/** The company's contact details, shown on the contact page. */
export interface ContactDetails {
  address: TranslationKey;
  /** The office on Google Maps. */
  mapUrl: string;
  /** International format with spaces, e.g. '+855 12 345 678'. */
  phone: string;
  /** WhatsApp number, in the same format as phone. */
  whatsapp?: string;
  /** Rows without a value are left off the page. */
  email?: string;
  hours?: TranslationKey;
}
