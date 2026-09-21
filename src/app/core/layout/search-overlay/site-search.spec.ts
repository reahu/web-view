import { SearchEntry, normalise, searchEntries } from './site-search';

const entries: SearchEntry[] = [
  { kind: 'Page', title: 'Investors', url: '/investors', external: false },
  { kind: 'Company', title: 'Commercial bank', url: '/c/bank', external: false, summary: 'Banking for investors' },
  { kind: 'News', title: 'Annual results', url: 'https://example.com', external: true, summary: 'Group results' },
];

describe('site search', () => {
  it('normalises case and accents', () => {
    expect(normalise('Phnom Pénh')).toBe('phnom penh');
  });

  it('returns nothing for an empty query', () => {
    expect(searchEntries(entries, '   ')).toEqual([]);
  });

  it('requires every word to match', () => {
    expect(searchEntries(entries, 'annual results').map((e) => e.title)).toEqual(['Annual results']);
    expect(searchEntries(entries, 'annual bank')).toEqual([]);
  });

  it('ranks title matches above summary-only matches', () => {
    expect(searchEntries(entries, 'INVESTORS').map((e) => e.title)).toEqual([
      'Investors',
      'Commercial bank',
    ]);
  });
});
