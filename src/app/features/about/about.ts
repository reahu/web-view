import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LangPathPipe } from '@core/i18n/lang-path-pipe';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { QuoteCta } from '@shared/ui/quote-cta/quote-cta';

@Component({
  imports: [RouterLink, QuoteCta, TranslatePipe, LangPathPipe],
  selector: 'rg-about',
  styleUrl: './about.scss',
  templateUrl: './about.html',
})
export class About {}
