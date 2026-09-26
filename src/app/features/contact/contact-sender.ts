import { InjectionToken, inject } from '@angular/core';
import { environment } from '@env/environment';

export const CONTACT_TOPICS = [
  { value: 'general', label: $localize`:@@contact.topic.general:General enquiry` },
  { value: 'quote', label: $localize`:@@contact.topic.quote:Sand supply and quotes` },
  { value: 'partnerships', label: $localize`:@@contact.topic.partnerships:Business partnerships` },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]['value'];

export const isContactTopic = (value: unknown): value is ContactTopic =>
  CONTACT_TOPICS.some((topic) => topic.value === value);

export interface ContactMessage {
  name: string;
  email: string;
  organisation: string;
  topic: ContactTopic;
  message: string;
}

/** Delivers a contact message; resolves when accepted, rejects on failure. */
export type ContactSender = (message: ContactMessage) => Promise<void>;

/** True while the form is a demo (environment.contact_demo): see CONTACT_SENDER. */
export const CONTACT_DEMO = new InjectionToken<boolean>('CONTACT_DEMO', {
  providedIn: 'root',
  factory: () => environment.contact_demo,
});

/**
 * The site is static, so sending needs an external endpoint (a form service or an API).
 * None is configured yet. In demo mode the default pretends to send after a short pause and
 * the page says the message wasn't sent; otherwise it rejects, and the form says sending
 * failed. Provide a real sender here, and turn contact_demo off, once the endpoint exists.
 */
export const CONTACT_SENDER = new InjectionToken<ContactSender>('CONTACT_SENDER', {
  providedIn: 'root',
  factory: () =>
    inject(CONTACT_DEMO)
      ? () => new Promise<void>((resolve) => setTimeout(resolve, 600))
      : () => Promise.reject(new Error('No contact endpoint is configured.')),
});
