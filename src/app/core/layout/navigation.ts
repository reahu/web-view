import { TranslationKey } from '@core/i18n/translations';

export interface NavLink {
  label: TranslationKey;
  /** Internal route, starting with '/'. */
  path: string;
}

export interface NavGroup {
  /** Used to build element ids; kebab-case. */
  id: string;
  label: TranslationKey;
  links: readonly NavLink[];
}

export type NavEntry = NavLink | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup => 'links' in entry;

/** Main navigation. Header and footer both render from this, so they can't drift apart. */
export const MAIN_NAV: readonly NavEntry[] = [
  {
    id: 'services',
    label: 'nav.services',
    links: [
      { label: 'nav.sand', path: '/services/sand' },
      { label: 'nav.minerals', path: '/services/minerals' },
    ],
  },
  { label: 'nav.organisation', path: '/organisation' },
  { label: 'nav.contact', path: '/contact-us' },
  { label: 'nav.about', path: '/about' },
];

export const LEGAL_NAV: readonly NavLink[] = [
  { label: 'nav.privacy', path: '/privacy-policy' },
  { label: 'nav.terms', path: '/terms-of-use' },
];
