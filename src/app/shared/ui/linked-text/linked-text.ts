import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LangPathPipe } from '@core/i18n/lang-path-pipe';

/**
 * A translated sentence with one link in it. The translation marks the link's words with
 * <a>…</a>, so each language puts the link where its word order needs it:
 *
 * "legal.contact": "Questions … through our <a>contact form</a>."
 * <rg-linked-text [text]="'legal.contact' | translate" path="/contact-us" />
 */
@Component({
  imports: [RouterLink, LangPathPipe],
  selector: 'rg-linked-text',
  // Inline: whitespace between the parts would show in the sentence, and a template file
  // ends with a newline.
  template: `{{ parts().before }}<a [routerLink]="path() | langPath">{{ parts().link }}</a
    >{{ parts().after }}`,
})
export class LinkedText {
  readonly text = input.required<string>();
  /** Internal route, starting with '/'. */
  readonly path = input.required<string>();

  protected readonly parts = computed(() => {
    const [before = '', link = '', after = ''] = this.text().split(/<\/?a>/);
    return { before, link, after };
  });
}
