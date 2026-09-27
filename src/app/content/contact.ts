import { ContactDetails } from '@core/models/contact-details';

// From the company's Google Maps listing (user, 2026-09-27). The listing leaves the district
// name blank ("Sangkat Cheung Ek, District, 12000"), so the address leaves it out too.
// No email address or opening hours yet: those rows stay hidden until the client sends them.
export const CONTACT_DETAILS: ContactDetails = {
  address: 'contact.details.address',
  mapUrl: 'https://maps.app.goo.gl/3E3FKrWdcBAqes5j9',
  phone: '+855 85 886 336',
  whatsapp: '+855 85 886 336',
};
