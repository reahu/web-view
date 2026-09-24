import { Component } from '@angular/core';
import { QuoteCta } from '@shared/ui/quote-cta/quote-cta';

@Component({
  imports: [QuoteCta],
  selector: 'rg-about',
  styleUrl: './about.scss',
  templateUrl: './about.html',
})
export class About {}
