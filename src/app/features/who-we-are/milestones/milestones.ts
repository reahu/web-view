import { Component, inject } from '@angular/core';
import { ContentService } from '@core/services/content.service';

@Component({
  selector: 'rg-milestones',
  styleUrl: './milestones.scss',
  templateUrl: './milestones.html',
})
export class Milestones {
  protected readonly milestones = inject(ContentService).milestones;
}
