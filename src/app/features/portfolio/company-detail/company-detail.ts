import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SECTOR_LABELS } from '@core/models/company';
import { ContentService } from '@core/services/content.service';
import { ExternalLink } from '@shared/ui/external-link/external-link';

@Component({
  imports: [NgOptimizedImage, RouterLink, ExternalLink],
  selector: 'rg-company-detail',
  styleUrl: './company-detail.scss',
  templateUrl: './company-detail.html',
})
export class CompanyDetail {
  /** Bound from the :slug route param. */
  readonly slug = input.required<string>();

  private readonly content = inject(ContentService);
  protected readonly company = this.content.companyBySlug(this.slug);
  protected readonly sectorLabel = computed(() => {
    const company = this.company();
    return company ? SECTOR_LABELS[company.sector] : '';
  });

  /** Other companies in the same sector. */
  protected readonly related = computed(() => {
    const company = this.company();
    if (!company) {
      return [];
    }
    return (this.content.companiesBySector().get(company.sector) ?? []).filter(
      (other) => other.slug !== company.slug,
    );
  });
}
