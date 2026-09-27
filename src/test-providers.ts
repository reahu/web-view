import {
  TranslateLoader,
  TranslationObject,
  provideTranslateLoader,
  provideTranslateService,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import english from './i18n/en.json';
import khmer from './i18n/km.json';
import chinese from './i18n/zh-Hans.json';

const FILES: Record<string, TranslationObject> = { en: english, km: khmer, 'zh-Hans': chinese };

/** Hands over each language at once, so a test's first render already has its text. */
class TestLoader implements TranslateLoader {
  getTranslation(code: string): Observable<TranslationObject> {
    return of(FILES[code]);
  }
}

/** Every test's providers (angular.json, test.providersFile): pages in English, as at /en. */
export default [
  provideTranslateService({ lang: 'en', loader: provideTranslateLoader(TestLoader) }),
];
