import { Component, inject } from '@angular/core';
import { ContentService } from '@core/services/content.service';
import { NewsCard } from '@shared/ui/news-card/news-card';

@Component({
  imports: [NewsCard],
  selector: 'rg-news',
  styleUrl: './news.scss',
  templateUrl: './news.html',
})
export class News {
  protected readonly news = inject(ContentService).news;
}
