import { Language } from '@core/i18n/languages';
import { TranslationKey } from '@core/i18n/translations';

/** A line printed in one script, tagged with its language so it's read and shaped right. */
export interface ScriptLine {
  lang: Language['code'];
  text: string;
}

/** The printed chart's heading, in all its scripts at once: the same on every language's page. */
export interface OrgHeading {
  company: readonly ScriptLine[];
  title: readonly ScriptLine[];
}

/** A person on the organisation chart. */
export interface OrgMember {
  /** Stable key, used for reporting lines and tracking. */
  id: string;
  /** Latin script, as on the client's chart, in every language. */
  name: string;
  /**
   * Root-relative portrait, 112x140. Only for people who agreed to their photo being
   * online; leave it out otherwise.
   */
  photo?: string;
  role: TranslationKey;
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
