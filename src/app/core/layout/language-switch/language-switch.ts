import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, computed, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { LanguageService } from '@core/i18n/language.service';
import { LANGUAGES, languagePath, pagePath } from '@core/i18n/languages';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { filter, map } from 'rxjs';

/**
 * A menu of the current page in every language. A <details> element, so it opens and its
 * links work in the prerendered HTML, before the app starts. Once it has, switching is a
 * navigation within the app: the page's text changes without reloading. Each language is
 * named in itself; the current one is marked, not linked. Escape, clicking outside, tabbing
 * away or switching closes it.
 */
@Component({
  imports: [RouterLink, TranslatePipe],
  selector: 'rg-language-switch',
  styleUrl: './language-switch.scss',
  templateUrl: './language-switch.html',
  host: {
    '(keydown.escape)': 'closeFromKeyboard($event)',
    '(focusout)': 'onFocusOut($event)',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class LanguageSwitch {
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly menu = viewChild<ElementRef<HTMLDetailsElement>>('menu');
  protected readonly current = inject(LanguageService).current;

  private readonly navigationEnd$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
  );

  private readonly url = toSignal(
    this.navigationEnd$.pipe(map((event) => event.urlAfterRedirects)),
    {
      initialValue: this.router.url,
    },
  );

  protected readonly links = computed(() => {
    const page = pagePath(this.url());
    return LANGUAGES.map((language) => ({
      language,
      url: this.router.parseUrl(languagePath(language, page)),
    }));
  });

  constructor() {
    // After a switch the chosen link is gone (it's now the current language), so focus goes
    // back to the button rather than being lost.
    this.navigationEnd$.pipe(takeUntilDestroyed()).subscribe(() => {
      const hadFocus = this.openMenu()?.contains(this.document.activeElement);
      if (this.close() && hadFocus) {
        this.openMenu(true)?.querySelector('summary')?.focus();
      }
    });
  }

  protected closeFromKeyboard(event: Event): void {
    const menu = this.openMenu();
    if (!menu) {
      return; // Nothing open here; let a surrounding element handle Escape.
    }
    event.stopPropagation();
    menu.open = false;
    menu.querySelector('summary')?.focus();
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && !this.host.contains(next)) {
      this.close();
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (event.target instanceof Node && !this.host.contains(event.target)) {
      this.close();
    }
  }

  /** The menu element while it's open (or, with `always`, whenever it's rendered). */
  private openMenu(always = false): HTMLDetailsElement | undefined {
    const menu = this.menu()?.nativeElement;
    return menu && (always || menu.open) ? menu : undefined;
  }

  /** Closes the menu; true if it was open. */
  private close(): boolean {
    const menu = this.openMenu();
    if (menu) {
      menu.open = false;
    }
    return !!menu;
  }
}
