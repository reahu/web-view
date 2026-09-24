/** A person on the organisation chart. */
export interface OrgMember {
  /** Stable key, used for reporting lines and tracking. */
  id: string;
  /** Latin script, as on the client's chart, in both languages. */
  name: string;
  /**
   * Root-relative portrait, 112x140 (shown at 56x70). Only for people who agreed to their
   * photo being online; leave it out otherwise.
   */
  photo?: string;
  role: string;
  /**
   * Ids of the people this person reports to. The first is where they sit in the chart;
   * any others are shown as "also reports to".
   */
  reportsTo: readonly string[];
}

/** A person placed in the chart, with the people who report to them. */
export interface OrgNode {
  member: OrgMember;
  /** Second and later reporting lines. */
  alsoReportsTo: readonly OrgMember[];
  reports: readonly OrgNode[];
}
