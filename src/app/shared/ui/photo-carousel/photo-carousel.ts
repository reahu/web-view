import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { TranslationKey } from '@core/i18n/translations';

export interface CarouselPhoto {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /** Its alt text's key in src/i18n. */
  readonly alt: TranslationKey;
}

/** How long each photo stays before the next slides in, in ms. */
const INTERVAL = 6000;
/** How far a finger or mouse must travel sideways to count as a swipe, in px. */
const SWIPE = 40;

/**
 * Photos that take turns in the middle, with the ones either side peeking out from behind it,
 * darkened. They move on by themselves every few seconds (not for visitors who ask for
 * reduced motion) and wait while a mouse is over them; a swipe, or a click on a neighbour,
 * moves them along by hand. Made for the dark hero.
 *
 * Give it at least four photos of one shape: with three, the one leaving on one side would be
 * seen sliding across to the other.
 */
@Component({
  imports: [NgOptimizedImage, TranslatePipe],
  selector: 'rg-photo-carousel',
  styleUrl: './photo-carousel.scss',
  templateUrl: './photo-carousel.html',
  host: {
    role: 'region',
    '[attr.aria-label]': 'label()',
    '(pointerenter)': 'onPointerEnter($event)',
    '(pointerleave)': 'hovered.set(false)',
  },
})
export class PhotoCarousel {
  readonly photos = input.required<readonly CarouselPhoto[]>();
  /** What the photos are, for screen readers. */
  readonly label = input.required<string>();
  /** Loads the first photo first: set it when the carousel is the page's main image. */
  readonly priority = input(false, { transform: booleanAttribute });

  protected readonly hovered = signal(false);
  private readonly current = signal(0);
  /** False for visitors who ask for reduced motion, and until the page runs in a browser. */
  private readonly autoplay = signal(false);
  private readonly playing = computed(() => this.autoplay() && !this.hovered());

  /** Where a press on the photos began, to tell a swipe from a click. */
  private pressedAt: number | undefined;

  constructor() {
    afterNextRender(() => this.autoplay.set(!prefersReducedMotion()));

    // Reads current() so the clock starts again whenever the photo changes, however it changed.
    effect((onCleanup) => {
      this.current();
      if (!this.playing()) {
        return;
      }
      const timer = setTimeout(() => this.next(), INTERVAL);
      onCleanup(() => clearTimeout(timer));
    });
  }

  /** Where a photo sits: 0 in the middle, -1 and 1 either side, further out hidden. */
  protected offset(index: number): number {
    const count = this.photos().length;
    const half = Math.floor(count / 2);
    return ((index - this.current() + count + half) % count) - half;
  }

  protected onPointerDown(event: PointerEvent): void {
    this.pressedAt = event.isPrimary && event.button === 0 ? event.clientX : undefined;
  }

  // A swipe moves one photo along. A press that stays put on a neighbour brings it to the
  // middle.
  protected onPointerUp(event: PointerEvent): void {
    if (this.pressedAt === undefined) {
      return;
    }
    const distance = event.clientX - this.pressedAt;
    this.pressedAt = undefined;
    if (distance <= -SWIPE) {
      this.next();
    } else if (distance >= SWIPE) {
      this.previous();
    } else {
      const slide = (event.target as Element).closest<HTMLElement>('[data-index]');
      if (slide) {
        this.show(Number(slide.dataset['index']));
      }
    }
  }

  protected onPointerCancel(): void {
    this.pressedAt = undefined;
  }

  // Only a mouse: a tap also sends pointerenter, and no pointerleave until the next tap elsewhere.
  protected onPointerEnter(event: PointerEvent): void {
    if (event.pointerType === 'mouse') {
      this.hovered.set(true);
    }
  }

  private show(index: number): void {
    const count = this.photos().length;
    this.current.set((index + count) % count);
  }

  private next(): void {
    this.show(this.current() + 1);
  }

  private previous(): void {
    this.show(this.current() - 1);
  }
}

function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
