export type Sector =
  | 'telecom-media'
  | 'finance'
  | 'insurance'
  | 'property'
  | 'hospitality'
  | 'infrastructure'
  | 'energy-resources'
  | 'retail-consumer';

/** Display names, in the order sectors are presented across the site. */
export const SECTOR_LABELS: Readonly<Record<Sector, string>> = {
  'telecom-media': 'Telecoms and media',
  finance: 'Finance',
  insurance: 'Insurance',
  property: 'Property',
  hospitality: 'Hospitality',
  infrastructure: 'Infrastructure',
  'energy-resources': 'Energy and resources',
  'retail-consumer': 'Retail and consumer',
};

export const SECTORS = Object.keys(SECTOR_LABELS) as readonly Sector[];

export interface Company {
  /** URL segment for /business-portfolio/:slug. */
  slug: string;
  name: string;
  sector: Sector;
  /** Root-relative path to an SVG logo. */
  logo: string;
  /** The company name, not the slug or filename. */
  logoAlt: string;
  website?: string;
  summary: string;
}
