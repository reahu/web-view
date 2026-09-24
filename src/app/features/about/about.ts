import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuoteCta } from '@shared/ui/quote-cta/quote-cta';

@Component({
  imports: [RouterLink, QuoteCta],
  selector: 'rg-about',
  styleUrl: './about.scss',
  templateUrl: './about.html',
})
export class About {}
