import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { SectionHeading } from '@shared/ui/section-heading/section-heading';

/**
 * Company logos drifting across the page. The list is rendered once: each logo runs
 * its own animation with a staggered negative delay, so no duplicate list is needed
 * for a seamless loop. Stopped, focused or reduced-motion, it becomes a static grid.
 */
@Component({
  imports: [NgOptimizedImage, RouterLink, SectionHeading],
  selector: 'rg-logo-marquee',
  styleUrl: './logo-marquee.scss',
  templateUrl: './logo-marquee.html',
})
export class LogoMarquee {
  protected readonly companies = inject(ContentService).companies;
  protected readonly stopped = signal(false);
}
