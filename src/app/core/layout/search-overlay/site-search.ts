export type SearchKind = 'Page' | 'Company' | 'News';

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  /** Internal route or, for external news, an absolute URL. */
  url: string;
  external: boolean;
  summary?: string;
}

const MAX_RESULTS = 20;

/** Lower-cases and strips accents so "Phnom Pénh" matches "phnom penh". */
export function normalise(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * Every word of the query must appear in the title or summary. Title matches rank above
 * summary-only matches; otherwise index order (pages, companies, news) is kept.
 */
export function searchEntries(entries: readonly SearchEntry[], query: string): SearchEntry[] {
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  if (!terms.length) {
    return [];
  }

  const scored: { entry: SearchEntry; score: number; index: number }[] = [];
  entries.forEach((entry, index) => {
    const title = normalise(entry.title);
    const text = `${title} ${normalise(entry.summary ?? '')}`;
    if (terms.every((term) => text.includes(term))) {
      const score = terms.filter((term) => title.includes(term)).length;
      scored.push({ entry, score, index });
    }
  });

  return scored
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, MAX_RESULTS)
    .map(({ entry }) => entry);
}
