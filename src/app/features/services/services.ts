import { Component, inject } from '@angular/core';
import { ContentService } from '@core/services/content.service';
import { ProcessSteps } from '@shared/ui/process-steps/process-steps';
import { QuoteCta } from '@shared/ui/quote-cta/quote-cta';

@Component({
  imports: [ProcessSteps, QuoteCta],
  selector: 'rg-services',
  styleUrl: './services.scss',
  templateUrl: './services.html',
})
export class Services {
  protected readonly steps = inject(ContentService).process;
}
