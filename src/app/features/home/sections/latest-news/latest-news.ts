import { Component, inject } from '@angular/core';
import { ContentService } from '@core/services/content.service';
import { NewsCard } from '@shared/ui/news-card/news-card';
import { SectionHeading } from '@shared/ui/section-heading/section-heading';

@Component({
  imports: [NewsCard, SectionHeading],
  selector: 'rg-latest-news',
  styleUrl: './latest-news.scss',
  templateUrl: './latest-news.html',
})
export class LatestNews {
  protected readonly news = inject(ContentService).latestNews(3);
}
