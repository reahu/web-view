import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '@core/services/content.service';

@Component({
  imports: [RouterLink],
  selector: 'rg-company-detail',
  styleUrl: './company-detail.scss',
  templateUrl: './company-detail.html',
})
export class CompanyDetail {
  /** Bound from the :slug route param. */
  readonly slug = input.required<string>();

  protected readonly company = inject(ContentService).companyBySlug(this.slug);
}
