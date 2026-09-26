import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { Component, LOCALE_ID, inject } from '@angular/core';
import { OrgMember } from '@core/models/org-member';
import { ContentService } from '@core/services/content.service';

/**
 * The organisation chart as nested lists, so the hierarchy is announced by screen readers
 * and works at any width. People with two managers sit under the first; the other is
 * named in text.
 */
@Component({
  imports: [NgOptimizedImage, NgTemplateOutlet],
  selector: 'rg-organisation',
  styleUrl: './organisation.scss',
  templateUrl: './organisation.html',
})
export class Organisation {
  protected readonly chart = inject(ContentService).orgChart;

  private readonly names = new Intl.ListFormat(inject(LOCALE_ID), { type: 'conjunction' });

  protected namesOf(members: readonly OrgMember[]): string {
    return this.names.format(members.map((member) => member.name));
  }
}
