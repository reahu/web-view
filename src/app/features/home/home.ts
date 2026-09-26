import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { ProcessSteps } from '@shared/ui/process-steps/process-steps';
import { QuoteCta } from '@shared/ui/quote-cta/quote-cta';
import { SectionHeading } from '@shared/ui/section-heading/section-heading';

@Component({
  imports: [NgOptimizedImage, RouterLink, SectionHeading, ProcessSteps, QuoteCta],
  selector: 'rg-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  protected readonly steps = inject(ContentService).process;
}
