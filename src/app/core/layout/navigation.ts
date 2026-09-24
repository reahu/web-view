export interface NavLink {
  label: string;
  /** Internal route, starting with '/'. */
  path: string;
}

export interface NavGroup {
  /** Used to build element ids; kebab-case. */
  id: string;
  label: string;
  links: readonly NavLink[];
}

export type NavEntry = NavLink | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup => 'links' in entry;

/** Main navigation. Header and footer both render from this, so they can't drift apart. */
export const MAIN_NAV: readonly NavEntry[] = [
  { label: $localize`:@@nav.about:About us`, path: '/about' },
  { label: $localize`:@@nav.services:Services`, path: '/services' },
  { label: $localize`:@@nav.contact:Contact us`, path: '/contact-us' },
];

export const LEGAL_NAV: readonly NavLink[] = [
  { label: $localize`:@@nav.privacy:Privacy policy`, path: '/privacy-policy' },
  { label: $localize`:@@nav.terms:Terms of use`, path: '/terms-of-use' },
];
