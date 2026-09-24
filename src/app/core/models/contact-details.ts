/** The company's contact details, shown on the contact page. */
export interface ContactDetails {
  /** Mock-up values: shown with a "sample" label, and phone and email aren't links. */
  sample: boolean;
  address: string;
  /** International format with spaces, e.g. '+855 12 345 678'. */
  phone: string;
  email: string;
  hours: string;
}
