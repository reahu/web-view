import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SECTORS, SECTOR_LABELS } from '@core/models/company';
import { ContentService } from '@core/services/content.service';

@Component({
  imports: [NgOptimizedImage, RouterLink],
  selector: 'rg-portfolio-list',
  styleUrl: './portfolio-list.scss',
  templateUrl: './portfolio-list.html',
})
export class PortfolioList {
  private readonly bySector = inject(ContentService).companiesBySector;

  /** Sectors in site order, skipping any without companies. */
  protected readonly groups = computed(() =>
    SECTORS.filter((sector) => this.bySector().has(sector)).map((sector) => ({
      sector,
      label: SECTOR_LABELS[sector],
      companies: this.bySector().get(sector) ?? [],
    })),
  );
}
