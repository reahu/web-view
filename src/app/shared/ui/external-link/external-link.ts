import { Component, input } from '@angular/core';

/**
 * A link to another site. Always opens in a new tab with rel="noopener noreferrer" and
 * says so: a visible icon plus screen-reader text.
 *
 * <rg-external-link href="https://example.com">Example</rg-external-link>
 */
@Component({
  selector: 'rg-external-link',
  styleUrl: './external-link.scss',
  templateUrl: './external-link.html',
})
export class ExternalLink {
  readonly href = input.required<string>();
  /** Extra classes for the inner <a>, e.g. 'button'. */
  readonly linkClass = input<string>('');
}
