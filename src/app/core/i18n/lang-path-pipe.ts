import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from './language.service';

/**
 * A page's URL in the current language, for routerLink: '/about' is '/en/about' on English
 * pages. Impure, as switching language changes the result without changing the path.
 *
 * <a [routerLink]="'/about' | langPath">
 */
@Pipe({ name: 'langPath', pure: false })
export class LangPathPipe implements PipeTransform {
  private readonly language = inject(LanguageService);

  transform(path: string): string {
    return this.language.path(path);
  }
}
