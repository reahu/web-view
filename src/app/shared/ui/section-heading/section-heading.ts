import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * A section's heading, with an optional intro line and an optional link to the full
 * page. Plain on purpose: no eyebrow label, no decorative arrow.
 */
@Component({
  imports: [RouterLink],
  selector: 'rg-section-heading',
  styleUrl: './section-heading.scss',
  templateUrl: './section-heading.html',
})
export class SectionHeading {
  readonly heading = input.required<string>();
  readonly level = input<2 | 3>(2);
  /** Set so the surrounding section can use aria-labelledby. */
  readonly headingId = input<string>();
  readonly intro = input<string>();
  readonly linkLabel = input<string>();
  /** Internal route for the link; the link renders only when both label and path are set. */
  readonly linkPath = input<string>();
}
