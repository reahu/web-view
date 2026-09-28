import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { ContentService } from '@core/services/content.service';
import { ProcessSteps } from '@shared/ui/process-steps/process-steps';
import { QuoteCta } from '@shared/ui/quote-cta/quote-cta';
import { VideoLoop } from '@shared/ui/video-loop/video-loop';

/** Sand dredging, supply and transport, in the client's words. */
@Component({
  imports: [NgOptimizedImage, ProcessSteps, QuoteCta, TranslatePipe, VideoLoop],
  selector: 'rg-sand',
  styleUrl: './sand.scss',
  templateUrl: './sand.html',
})
export class Sand {
  protected readonly steps = inject(ContentService).process;
}
