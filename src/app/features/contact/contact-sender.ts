import { InjectionToken } from '@angular/core';

export const CONTACT_TOPICS = [
  { value: 'general', label: 'General enquiry' },
  { value: 'quote', label: 'Sand supply and quotes' },
  { value: 'partnerships', label: 'Business partnerships' },
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

/**
 * The site is static, so sending needs an external endpoint (a form service or an API).
 * None is configured yet: the default rejects, and the form tells the user it failed
 * rather than pretending to send. Provide a real sender here once the endpoint exists.
 */
export const CONTACT_SENDER = new InjectionToken<ContactSender>('CONTACT_SENDER', {
  providedIn: 'root',
  factory: () => () => Promise.reject(new Error('No contact endpoint is configured.')),
});
