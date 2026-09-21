import { Company } from '@core/models/company';

const PLACEHOLDER_LOGO = '/images/placeholders/logo.svg';

// Placeholder companies, one or two per sector. Replace names, slugs, logos and
// summaries with the confirmed portfolio before launch.
export const COMPANIES: readonly Company[] = [
  {
    slug: 'mobile-network',
    name: 'Mobile network (placeholder)',
    sector: 'telecom-media',
    logo: PLACEHOLDER_LOGO,
    logoAlt: 'Mobile network (placeholder)',
    summary: 'Placeholder summary. A nationwide mobile and data network serving consumers and businesses.',
  },
  {
    slug: 'television-network',
    name: 'Television network (placeholder)',
    sector: 'telecom-media',
    logo: PLACEHOLDER_LOGO,
    logoAlt: 'Television network (placeholder)',
    summary: 'Placeholder summary. Free-to-air and digital channels covering news, sport and entertainment.',
  },
  {
    slug: 'commercial-bank',
    name: 'Commercial bank (placeholder)',
    sector: 'finance',
    logo: PLACEHOLDER_LOGO,
    logoAlt: 'Commercial bank (placeholder)',
    summary: 'Placeholder summary. Retail and corporate banking for Cambodian households and companies.',
  },
  {
    slug: 'general-insurance',
    name: 'General insurance (placeholder)',
    sector: 'insurance',
    logo: PLACEHOLDER_LOGO,
    logoAlt: 'General insurance (placeholder)',
    summary: 'Placeholder summary. Property, motor and health cover for individuals and businesses.',
  },
  {
    slug: 'property-development',
    name: 'Property development (placeholder)',
    sector: 'property',
    logo: PLACEHOLDER_LOGO,
    logoAlt: 'Property development (placeholder)',
    summary: 'Placeholder summary. Residential and commercial developments in Phnom Penh.',
  },
  {
    slug: 'island-resort',
    name: 'Island resort (placeholder)',
    sector: 'hospitality',
    logo: PLACEHOLDER_LOGO,
    logoAlt: 'Island resort (placeholder)',
    summary: 'Placeholder summary. A beachfront resort on the Cambodian coast.',
  },
  {
    slug: 'railway',
    name: 'Railway operator (placeholder)',
    sector: 'infrastructure',
    logo: PLACEHOLDER_LOGO,
    logoAlt: 'Railway operator (placeholder)',
    summary: 'Placeholder summary. Freight and passenger rail services on the national network.',
  },
  {
    slug: 'special-economic-zone',
    name: 'Special economic zone (placeholder)',
    sector: 'infrastructure',
    logo: PLACEHOLDER_LOGO,
    logoAlt: 'Special economic zone (placeholder)',
    summary: 'Placeholder summary. Serviced industrial land and logistics for manufacturers.',
  },
  {
    slug: 'energy',
    name: 'Energy company (placeholder)',
    sector: 'energy-resources',
    logo: PLACEHOLDER_LOGO,
    logoAlt: 'Energy company (placeholder)',
    summary: 'Placeholder summary. Power generation and resource projects.',
  },
  {
    slug: 'consumer-brands',
    name: 'Consumer brands (placeholder)',
    sector: 'retail-consumer',
    logo: PLACEHOLDER_LOGO,
    logoAlt: 'Consumer brands (placeholder)',
    summary: 'Placeholder summary. Distribution of food, beverage and household brands.',
  },
];
