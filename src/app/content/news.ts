import { NewsItem } from '@core/models/news-item';

// Placeholder news. External URLs point at example.com until real links are supplied.
export const NEWS: readonly NewsItem[] = [
  {
    id: 'placeholder-2026-08',
    date: '2026-08-18',
    title: 'Placeholder headline about a new partnership',
    excerpt:
      'Placeholder excerpt. This paragraph stands in for the opening lines of a press release and is long enough to show how the card clamps text to a fixed number of lines without adding an ellipsis in the content itself.',
    url: 'https://example.com/news/partnership',
    external: true,
  },
  {
    id: 'placeholder-2026-06',
    date: '2026-06-02',
    title: 'Placeholder headline about community investment',
    excerpt:
      'Placeholder excerpt. A short summary of a corporate social responsibility programme, its partners and the communities it serves.',
    url: 'https://example.com/news/community',
    external: true,
  },
  {
    id: 'placeholder-2026-03',
    date: '2026-03-14',
    title: 'Placeholder headline about annual results',
    excerpt:
      'Placeholder excerpt. A summary of the year across the group’s eight sectors, with a link to the full announcement.',
    url: 'https://example.com/news/results',
    external: true,
  },
];
