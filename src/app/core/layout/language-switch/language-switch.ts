import { Component, LOCALE_ID, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { LANGUAGES, languageFor, languagePath } from '@core/i18n/languages';
import { filter, map } from 'rxjs';

/**
 * Links to the current page in the other language. A plain link, not routerLink: each
 * language is a separate build, so switching loads the other one. Prerendered with the
 * right URL, so it works before the app starts. It shows the language's flag; the link's
 * text, for screen readers, is the language's name in itself.
 */
@Component({
  selector: 'rg-language-switch',
  styleUrl: './language-switch.scss',
  templateUrl: './language-switch.html',
})
export class LanguageSwitch {
  private readonly router = inject(Router);
  private readonly current = languageFor(inject(LOCALE_ID));

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly links = computed(() =>
    LANGUAGES.filter((language) => language !== this.current).map((language) => ({
      language,
      href: languagePath(language, this.url()),
    })),
  );
}
