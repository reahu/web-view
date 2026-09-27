import { Component } from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { LinkedText } from '@shared/ui/linked-text/linked-text';

@Component({
  imports: [LinkedText, TranslatePipe],
  selector: 'rg-not-found',
  styleUrl: './not-found.scss',
  templateUrl: './not-found.html',
})
export class NotFound {}
