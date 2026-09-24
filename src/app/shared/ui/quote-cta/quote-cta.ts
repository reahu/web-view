import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Full-width band asking for a quote; opens the contact form with the quote topic chosen. */
@Component({
  imports: [RouterLink],
  selector: 'rg-quote-cta',
  styleUrl: './quote-cta.scss',
  templateUrl: './quote-cta.html',
})
export class QuoteCta {}
