import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LangPathPipe } from '@core/i18n/lang-path-pipe';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { TranslationKey } from '@core/i18n/translations';

/**
 * Full-width band that sends visitors to the contact page. The default wording fits every
 * service; a service's page words it for its own customers.
 */
@Component({
  imports: [RouterLink, TranslatePipe, LangPathPipe],
  selector: 'rg-quote-cta',
  styleUrl: './quote-cta.scss',
  templateUrl: './quote-cta.html',
})
export class QuoteCta {
  readonly heading = input<TranslationKey>('cta.heading');
  readonly body = input<TranslationKey>('cta.body');
  /** The link's text. */
  readonly action = input<TranslationKey>('nav.contact');
}
