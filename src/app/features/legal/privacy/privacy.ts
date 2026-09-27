import { Component } from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { LinkedText } from '@shared/ui/linked-text/linked-text';

@Component({
  imports: [LinkedText, TranslatePipe],
  selector: 'rg-privacy',
  styleUrl: './privacy.scss',
  templateUrl: './privacy.html',
})
export class Privacy {}
