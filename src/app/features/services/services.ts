import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { ContentService } from '@core/services/content.service';
import { ProcessSteps } from '@shared/ui/process-steps/process-steps';
import { QuoteCta } from '@shared/ui/quote-cta/quote-cta';

@Component({
  imports: [ProcessSteps, QuoteCta, TranslatePipe],
  selector: 'rg-services',
  styleUrl: './services.scss',
  templateUrl: './services.html',
})
export class Services {
  protected readonly steps = inject(ContentService).process;
}
