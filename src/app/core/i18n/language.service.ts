import { DOCUMENT } from '@angular/common';
import { Service, computed, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { LANGUAGES, Language, languageByCode, languagePath } from './languages';

/**
 * The page's language. The URL decides it (see app.routes.ts); this loads the language's
 * strings, switches every translated text to them and sets <html lang>, which the Khmer
 * styles (:lang(km)) depend on.
 */
@Service()
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  /** Khmer until a language is used. */
  readonly current = computed(() => languageByCode(this.translate.currentLang()) ?? LANGUAGES[0]);

  /** Resolves once the language's strings are loaded and showing. */
  async use(language: Language): Promise<void> {
    await firstValueFrom(this.translate.use(language.code));
    this.document.documentElement.setAttribute('lang', language.code);
  }

  /** Root-relative URL of a page ('/about') in the current language. */
  path(path: string): string {
    return languagePath(this.current(), path);
  }
}
