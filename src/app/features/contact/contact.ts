import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { ContentService } from '@core/services/content.service';

@Component({
  imports: [TranslatePipe],
  selector: 'rg-contact',
  styleUrl: './contact.scss',
  templateUrl: './contact.html',
})
export class Contact {
  protected readonly details = inject(ContentService).contactDetails;
  /** wa.me takes the international number as digits only. */
  protected readonly whatsappUrl = computed(() => {
    const number = this.details().whatsapp;
    return number && `https://wa.me/${number.replace(/\D/g, '')}`;
  });
}
