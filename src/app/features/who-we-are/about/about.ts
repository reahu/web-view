import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SECTORS, SECTOR_LABELS } from '@core/models/company';

@Component({
  imports: [RouterLink],
  selector: 'rg-about',
  styleUrl: './about.scss',
  templateUrl: './about.html',
})
export class About {
  protected readonly sectors = SECTORS.map((id) => ({ id, label: SECTOR_LABELS[id] }));
}
