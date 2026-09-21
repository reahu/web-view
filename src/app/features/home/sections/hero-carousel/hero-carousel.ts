import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '@core/services/content.service';

/** Time each slide stays up while autoplaying. */
export const HERO_INTERVAL_MS = 7000;

/**
 * Home page hero. Autoplays in the browser only, pauses on hover and focus, has a
 * visible pause control, and starts paused under prefers-reduced-motion.
 */
@Component({
  imports: [NgOptimizedImage, RouterLink],
  selector: 'rg-hero-carousel',
  styleUrl: './hero-carousel.scss',
  templateUrl: './hero-carousel.html',
  host: {
    '(mouseenter)': 'hovering.set(true)',
    '(mouseleave)': 'hovering.set(false)',
    '(focusin)': 'focusWithin.set(true)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class HeroCarousel {
  protected readonly slides = inject(ContentService).slides;
  protected readonly active = signal(0);

  /** False until the browser has rendered; nothing animates during prerender. */
  private readonly ready = signal(false);
  protected readonly autoplay = signal(true);
  protected readonly hovering = signal(false);
  protected readonly focusWithin = signal(false);

  protected readonly running = computed(
    () =>
      this.ready() &&
      this.autoplay() &&
      !this.hovering() &&
      !this.focusWithin() &&
      this.slides().length > 1,
  );

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (typeof matchMedia === 'function') {
        const reduce = matchMedia('(prefers-reduced-motion: reduce)');
        this.autoplay.set(!reduce.matches);
        const onChange = () => reduce.matches && this.autoplay.set(false);
        reduce.addEventListener('change', onChange);
        destroyRef.onDestroy(() => reduce.removeEventListener('change', onChange));
      }
      this.ready.set(true);
    });

    // Restarts whenever the slide changes, so a manual change gets a full interval.
    effect((onCleanup) => {
      if (!this.running()) {
        return;
      }
      const current = this.active();
      const timer = setTimeout(() => this.show(current + 1), HERO_INTERVAL_MS);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected show(index: number): void {
    const count = this.slides().length;
    this.active.set(((index % count) + count) % count);
  }

  protected toggleAutoplay(): void {
    this.autoplay.update((on) => !on);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !(event.currentTarget as HTMLElement).contains(next)) {
      this.focusWithin.set(false);
    }
  }
}
