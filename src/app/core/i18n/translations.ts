import { Location } from '@angular/common';
import { EnvironmentProviders, Provider, inject, provideAppInitializer } from '@angular/core';
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateLoader,
  provideTranslateService,
} from '@ngx-translate/core';
import { Observable, from } from 'rxjs';
import type english from '../../../i18n/en.json';
import { LanguageService } from './language.service';
import { Language, languageOfUrl } from './languages';

/** Every string's key, from src/i18n/en.json. The translate pipe takes nothing else. */
export type TranslationKey = keyof typeof english;

/**
 * Each language's strings, bundled as their own chunk and loaded on first use. An import
 * rather than a request, so it works the same in the browser and while prerendering.
 */
const FILES: Record<Language['code'], () => Promise<{ default: TranslationObject }>> = {
  km: () => import('../../../i18n/km.json'),
  en: () => import('../../../i18n/en.json'),
  'zh-Hans': () => import('../../../i18n/zh-Hans.json'),
};

class FileLoader implements TranslateLoader {
  getTranslation(code: string): Observable<TranslationObject> {
    return from(FILES[code as Language['code']]().then((file) => file.default));
  }
}

export function provideTranslations(): (Provider | EnvironmentProviders)[] {
  return [
    // A factory, not the class: ngx-translate tells them apart by the source text starting
    // with "class ", which the minified production build doesn't keep ("var x=class{…}").
    provideTranslateService({ loader: provideTranslateLoader(() => new FileLoader()) }),
    // The page's strings load before the app first renders, so it hydrates the prerendered
    // text as it is. Later switches load theirs from the route (app.routes.ts).
    provideAppInitializer(() =>
      inject(LanguageService).use(languageOfUrl(inject(Location).path())),
    ),
  ];
}
