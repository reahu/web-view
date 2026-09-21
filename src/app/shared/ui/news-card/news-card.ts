import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsItem } from '@core/models/news-item';
import { ExternalLink } from '../external-link/external-link';

@Component({
  imports: [DatePipe, NgTemplateOutlet, RouterLink, ExternalLink],
  selector: 'rg-news-card',
  styleUrl: './news-card.scss',
  templateUrl: './news-card.html',
})
export class NewsCard {
  readonly item = input.required<NewsItem>();
  /** 3 under a section's h2; 2 when the page itself is the news list. */
  readonly headingLevel = input<2 | 3>(3);
}
