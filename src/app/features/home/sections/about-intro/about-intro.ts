import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SECTORS, SECTOR_LABELS } from '@core/models/company';

@Component({
  imports: [RouterLink],
  selector: 'rg-about-intro',
  styleUrl: './about-intro.scss',
  templateUrl: './about-intro.html',
})
export class AboutIntro {
  protected readonly sectors = SECTORS.map((id) => ({ id, label: SECTOR_LABELS[id] }));
}
