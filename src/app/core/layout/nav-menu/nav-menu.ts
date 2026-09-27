import { Component, ElementRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { pagePath } from '@core/i18n/languages';
import { LangPathPipe } from '@core/i18n/lang-path-pipe';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { filter, map } from 'rxjs';
import { MAIN_NAV, NavEntry, NavGroup, isNavGroup } from '../navigation';

/**
 * Main navigation using the disclosure pattern: group parents are buttons with
 * aria-expanded that show a plain list of links. One group is open at a time; Escape,
 * clicking outside, tabbing away or navigating closes it.
 */
@Component({
  imports: [RouterLink, RouterLinkActive, TranslatePipe, LangPathPipe],
  selector: 'rg-nav-menu',
  styleUrl: './nav-menu.scss',
  templateUrl: './nav-menu.html',
  host: {
    '(keydown.escape)': 'closeFromKeyboard($event)',
    '(focusout)': 'onFocusOut($event)',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class NavMenu {
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly router = inject(Router);

  /** The site's menu; tests pass their own, since MAIN_NAV may have no groups. */
  readonly entries = input<readonly NavEntry[]>(MAIN_NAV);
  protected readonly isNavGroup = isNavGroup;
  protected readonly openGroup = signal<string | null>(null);

  private readonly navigationEnd$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
  );

  /** Current page's path, without its language prefix, query string or fragment. */
  private readonly path = toSignal(
    this.navigationEnd$.pipe(map((event) => stripUrl(event.urlAfterRedirects))),
    { initialValue: stripUrl(this.router.url) },
  );

  constructor() {
    this.navigationEnd$.pipe(takeUntilDestroyed()).subscribe(() => this.openGroup.set(null));
  }

  protected toggle(id: string): void {
    this.openGroup.update((current) => (current === id ? null : id));
  }

  /** A group parent is highlighted when the current page is one of its links. */
  protected isGroupActive(group: NavGroup): boolean {
    const path = this.path();
    return group.links.some((link) => path === link.path || path.startsWith(`${link.path}/`));
  }

  protected closeFromKeyboard(event: Event): void {
    const id = this.openGroup();
    if (!id) {
      return; // Nothing open here; let a surrounding drawer handle Escape.
    }
    event.stopPropagation();
    this.openGroup.set(null);
    this.host.querySelector<HTMLButtonElement>(`#nav-trigger-${id}`)?.focus();
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && !this.host.contains(next)) {
      this.openGroup.set(null);
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (event.target instanceof Node && !this.host.contains(event.target)) {
      this.openGroup.set(null);
    }
  }
}

function stripUrl(url: string): string {
  return pagePath(url).split(/[?#]/, 1)[0] || '/';
}
