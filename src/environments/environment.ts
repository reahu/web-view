export const environment = {
  production: false,
  api_url: '',
  /**
   * Public origin, no trailing slash. Used for canonical and Open Graph URLs and the sitemap.
   * Placeholder: Malin's domain isn't confirmed yet.
   */
  site_url: 'https://www.example.com',
  /** Not production: every page gets noindex and no sitemap is written. */
  indexable: false,
  /**
   * The contact form isn't connected to a service yet: sending is simulated and the page says
   * the message wasn't sent. Set false once a real CONTACT_SENDER is provided.
   */
  contact_demo: true,
};
