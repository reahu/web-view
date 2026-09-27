import { Component } from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { LinkedText } from '@shared/ui/linked-text/linked-text';

@Component({
  imports: [LinkedText, TranslatePipe],
  selector: 'rg-terms',
  styleUrl: './terms.scss',
  templateUrl: './terms.html',
})
export class Terms {}
