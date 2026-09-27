import { Component } from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { QuoteCta } from '@shared/ui/quote-cta/quote-cta';

/**
 * Mineral exploration and mining licensing, in the client's words. The steps and licences
 * are lists the client wrote as sentences: add to them only what the client has said.
 */
@Component({
  imports: [QuoteCta, TranslatePipe],
  selector: 'rg-minerals',
  styleUrl: './minerals.scss',
  templateUrl: './minerals.html',
})
export class Minerals {}
