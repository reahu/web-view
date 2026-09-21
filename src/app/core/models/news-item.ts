export interface NewsItem {
  id: string;
  /** ISO 8601 date, e.g. '2026-03-14'. */
  date: string;
  title: string;
  /** Full excerpt; truncation is done in CSS with line-clamp. */
  excerpt: string;
  url: string;
  /** True when url points to another site. */
  external: boolean;
}
