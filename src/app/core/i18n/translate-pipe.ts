import { Pipe, PipeTransform } from '@angular/core';
import { InterpolationParameters, TranslatePipe as NgxTranslatePipe } from '@ngx-translate/core';
import { TranslationKey } from './translations';

/**
 * ngx-translate's `translate` pipe, taking only keys that are in src/i18n/en.json, so a
 * mistyped key fails the build:
 *
 * {{ 'about.title' | translate }}
 * {{ 'footer.copyright' | translate: { year } }}
 */
@Pipe({ name: 'translate', pure: false })
export class TranslatePipe extends NgxTranslatePipe implements PipeTransform {
  override transform(key: TranslationKey, params?: InterpolationParameters): string {
    return super.transform(key, params);
  }
}
