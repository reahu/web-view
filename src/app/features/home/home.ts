import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LangPathPipe } from '@core/i18n/lang-path-pipe';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { QuoteCta } from '@shared/ui/quote-cta/quote-cta';
import { SectionHeading } from '@shared/ui/section-heading/section-heading';

@Component({
  imports: [NgOptimizedImage, RouterLink, SectionHeading, QuoteCta, TranslatePipe, LangPathPipe],
  selector: 'rg-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
