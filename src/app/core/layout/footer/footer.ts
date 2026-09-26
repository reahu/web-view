import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEGAL_NAV, MAIN_NAV, NavGroup, NavLink, isNavGroup } from '../navigation';

@Component({
  imports: [RouterLink],
  selector: 'rg-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {
  /** Main nav groups become columns; top-level links are collected into one more. */
  protected readonly columns: readonly NavGroup[] = [
    ...MAIN_NAV.filter(isNavGroup),
    {
      id: 'company',
      label: $localize`:@@footer.company:Company`,
      links: MAIN_NAV.filter((entry): entry is NavLink => !isNavGroup(entry)),
    },
  ];

  protected readonly legal = LEGAL_NAV;

  /** Computed at render time, never hardcoded. */
  protected readonly year = new Date().getFullYear();
}
