import { ContactDetails } from '@core/models/contact-details';

// Sample details for the mock-up (user, 2026-09-24); the company's real details replace them
// before launch. The phone number starts with 00, which no Cambodian number does, so it can't
// ring anyone. Never put sample values in the JSON-LD.
export const CONTACT_DETAILS: ContactDetails = {
  sample: true,
  address: $localize`:@@contact.details.address:Street 000, Koh Kong Province, Cambodia`,
  phone: '+855 00 000 000',
  email: 'info@example.com',
  hours: $localize`:@@contact.details.hours:Monday to Saturday, 8:00 to 17:00`,
};
