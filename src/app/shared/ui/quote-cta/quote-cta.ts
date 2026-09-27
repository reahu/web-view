import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LangPathPipe } from '@core/i18n/lang-path-pipe';
import { TranslatePipe } from '@core/i18n/translate-pipe';

/** Full-width band asking for a quote; opens the contact form with the quote topic chosen. */
@Component({
  imports: [RouterLink, TranslatePipe, LangPathPipe],
  selector: 'rg-quote-cta',
  styleUrl: './quote-cta.scss',
  templateUrl: './quote-cta.html',
})
export class QuoteCta {}
