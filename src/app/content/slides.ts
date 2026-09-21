import { HeroSlide } from '@core/models/hero-slide';

// Placeholder copy and images. Replace when the client supplies final assets.
export const SLIDES: readonly HeroSlide[] = [
  {
    id: 'building-cambodia',
    title: 'Building the businesses Cambodia runs on',
    image: '/images/placeholders/hero-1.webp',
    imageAlt: 'Placeholder photo: Phnom Penh skyline at dusk',
    ctaLabel: 'View our portfolio',
    ctaLink: '/business-portfolio',
  },
  {
    id: 'investors',
    title: 'A long-term partner for investors',
    image: '/images/placeholders/hero-2.webp',
    imageAlt: 'Placeholder photo: executives meeting with partners',
    ctaLabel: 'Read investor information',
    ctaLink: '/investors',
  },
  {
    id: 'careers',
    title: 'Work across eight industries',
    image: '/images/placeholders/hero-3.webp',
    imageAlt: 'Placeholder photo: employees at a Royal Group office',
    ctaLabel: 'See open roles',
    ctaLink: '/careers',
  },
];
