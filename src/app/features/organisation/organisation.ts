import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { LanguageService } from '@core/i18n/language.service';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { OrgMember, OrgNode } from '@core/models/org-member';
import { ContentService } from '@core/services/content.service';

/**
 * One or more people drawn side by side over one bracket, as on the printed chart: people
 * sit together when someone below them reports to them all (Vith Sreymey to Jia Junxian and
 * Hok Cheaven). Everyone else is a group of one.
 */
export interface OrgGroup {
  heads: readonly OrgNode[];
  reports: readonly OrgGroup[];
}

/**
 * Groups siblings in order: a person joins the group before them when one of that group's
 * reports also reports to them. A second manager who isn't the next sibling stays apart, and
 * is named in text only.
 */
export function groupChart(nodes: readonly OrgNode[]): OrgGroup[] {
  const groups: OrgNode[][] = [];
  for (const node of nodes) {
    const previous = groups.at(-1);
    const shares = previous?.some((head) =>
      head.reports.some((report) => report.alsoReportsTo.some((m) => m.id === node.member.id)),
    );
    if (previous && shares) {
      previous.push(node);
    } else {
      groups.push([node]);
    }
  }
  return groups.map((heads) => ({
    heads,
    reports: groupChart(heads.flatMap((head) => head.reports)),
  }));
}

/**
 * The organisation chart as nested lists, so the hierarchy is announced by screen readers
 * and works at any width. People with two managers sit under the first; the other is
 * named in text.
 */
@Component({
  imports: [NgOptimizedImage, NgTemplateOutlet, TranslatePipe],
  selector: 'rg-organisation',
  styleUrl: './organisation.scss',
  templateUrl: './organisation.html',
})
export class Organisation {
  private readonly orgChart = inject(ContentService).orgChart;
  protected readonly chart = computed(() => groupChart(this.orgChart()));

  private readonly language = inject(LanguageService).current;
  private readonly names = computed(
    () => new Intl.ListFormat(this.language().code, { type: 'conjunction' }),
  );

  protected namesOf(members: readonly OrgMember[]): string {
    return this.names().format(members.map((member) => member.name));
  }
}
