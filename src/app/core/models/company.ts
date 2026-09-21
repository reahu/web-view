export type Sector =
  | 'telecom-media'
  | 'finance'
  | 'insurance'
  | 'property'
  | 'hospitality'
  | 'infrastructure'
  | 'energy-resources'
  | 'retail-consumer';

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
