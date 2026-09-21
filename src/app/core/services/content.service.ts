import { Service, Signal, computed, signal } from '@angular/core';
import { COMPANIES } from '@content/companies';
import { MILESTONES } from '@content/milestones';
import { NEWS } from '@content/news';
import { VIDEOS } from '@content/videos';
import { SLIDES } from '@content/slides';
import { Company, Sector } from '@core/models/company';
import { HeroSlide } from '@core/models/hero-slide';
import { MediaVideo } from '@core/models/media-video';
import { Milestone } from '@core/models/milestone';
import { NewsItem } from '@core/models/news-item';

/**
 * The only way components read site content. Everything is exposed as signals so the
 * static arrays in src/app/content can later be swapped for httpResource() calls
 * without touching any component.
 */
@Service()
export class ContentService {
  readonly slides: Signal<readonly HeroSlide[]> = signal(SLIDES).asReadonly();

  readonly companies: Signal<readonly Company[]> = signal(COMPANIES).asReadonly();

  readonly videos: Signal<readonly MediaVideo[]> = signal(VIDEOS).asReadonly();

  /** Newest first. */
  readonly news: Signal<readonly NewsItem[]> = computed(() =>
    [...NEWS].sort((a, b) => b.date.localeCompare(a.date)),
  );

  /** Oldest first. */
  readonly milestones: Signal<readonly Milestone[]> = computed(() =>
    [...MILESTONES].sort((a, b) => a.year - b.year),
  );

  /** Companies grouped by sector, in the order sectors first appear. */
  readonly companiesBySector: Signal<ReadonlyMap<Sector, readonly Company[]>> = computed(() => {
    const groups = new Map<Sector, Company[]>();
    for (const company of this.companies()) {
      const group = groups.get(company.sector);
      if (group) {
        group.push(company);
      } else {
        groups.set(company.sector, [company]);
      }
    }
    return groups;
  });

  /** Reactive lookup, e.g. `content.companyBySlug(this.slug)` with a route-param input. */
  companyBySlug(slug: Signal<string>): Signal<Company | undefined> {
    return computed(() => this.companies().find((c) => c.slug === slug()));
  }

  latestNews(count: number): Signal<readonly NewsItem[]> {
    return computed(() => this.news().slice(0, count));
  }
}
