import { Component, ElementRef, computed, inject, output, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormField, form } from '@angular/forms/signals';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { ExternalLink } from '@shared/ui/external-link/external-link';
import { filter } from 'rxjs';
import { LEGAL_NAV, MAIN_NAV, NavLink, isNavGroup } from '../navigation';
import { SearchEntry, searchEntries } from './site-search';

/**
 * Site search in a native modal <dialog>: the browser supplies the focus trap, Escape
 * and the inert background. Searches pages, companies and news client-side.
 */
@Component({
  imports: [FormField, RouterLink, ExternalLink],
  selector: 'rg-search-overlay',
  styleUrl: './search-overlay.scss',
  templateUrl: './search-overlay.html',
  host: {
    // Mouse-only convenience; keyboard users have Escape and the close button.
    '(click)': 'onDialogClick($event)',
  },
})
export class SearchOverlay {
  /** Emits after the dialog closes, so the opener can take focus back. */
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly content = inject(ContentService);

  protected readonly searchForm = form(signal({ query: '' }));
  protected readonly isOpen = signal(false);

  private readonly index = computed<SearchEntry[]>(() => {
    const pages: NavLink[] = [
      ...MAIN_NAV.flatMap((entry) => (isNavGroup(entry) ? entry.links : [entry])),
      ...LEGAL_NAV,
    ];
    return [
      ...pages.map((page) => ({
        kind: 'Page' as const,
        title: page.label,
        url: page.path,
        external: false,
      })),
      ...this.content.companies().map((company) => ({
        kind: 'Company' as const,
        title: company.name,
        url: `/business-portfolio/${company.slug}`,
        external: false,
        summary: company.summary,
      })),
      ...this.content.news().map((item) => ({
        kind: 'News' as const,
        title: item.title,
        url: item.url,
        external: item.external,
        summary: item.excerpt,
      })),
    ];
  });

  protected readonly query = computed(() => this.searchForm.query().value().trim());
  protected readonly results = computed(() => searchEntries(this.index(), this.query()));

  protected readonly status = computed(() => {
    const count = this.results().length;
    if (!this.query()) {
      return 'Type to search pages, companies and news.';
    }
    if (!count) {
      return `No results for “${this.query()}”.`;
    }
    return count === 1 ? '1 result' : `${count} results`;
  });

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.close());
  }

  open(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) {
      return;
    }
    this.searchForm.query().value.set('');
    dialog.showModal();
    // showModal() would focus the first control (Close); start in the search box instead.
    dialog.querySelector<HTMLInputElement>('#site-search')?.focus();
    this.isOpen.set(true);
  }

  close(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) {
      dialog.close();
    }
  }

  /** Fires for Escape, the close button and navigation alike. */
  protected onClose(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  /** A click on the dialog element itself (not its panel) is a backdrop click. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }
}
