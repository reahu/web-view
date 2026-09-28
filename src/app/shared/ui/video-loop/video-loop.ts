import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate-pipe';

/**
 * A short silent clip from public/videos that plays on a loop while it's on screen, with a
 * button to pause it. Nothing downloads until the clip is on screen. Visitors who ask for
 * reduced motion or to save data see its first frame (the poster) until they press play.
 *
 * Replace a clip by its same file name; see the README's Videos section.
 */
@Component({
  imports: [TranslatePipe],
  selector: 'rg-video-loop',
  styleUrl: './video-loop.scss',
  templateUrl: './video-loop.html',
})
export class VideoLoop {
  /** The MP4. Its poster is the WebP beside it with the same name. */
  readonly src = input.required<string>();
  readonly width = input.required<number>();
  readonly height = input.required<number>();
  /** What the clip shows, for screen readers. */
  readonly label = input.required<string>();

  protected readonly poster = computed(() => this.src().replace(/\.mp4$/, '.webp'));
  protected readonly playing = signal(false);

  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  /** Set while the visitor keeps the clip paused: scrolling back doesn't start it again. */
  private held = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const video = this.video().nativeElement;
      // The muted attribute only mutes a video that has it when it's created, which one added
      // by client-side navigation doesn't, and browsers only play muted video by themselves.
      video.muted = true;

      if (typeof IntersectionObserver !== 'function' || !autoplayWanted()) {
        this.held = true;
        return;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            video.pause();
          } else if (!this.held) {
            this.play();
          }
        },
        { threshold: 0.25 },
      );
      observer.observe(video);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected toggle(): void {
    const video = this.video().nativeElement;
    this.held = !video.paused;
    if (this.held) {
      video.pause();
    } else {
      this.play();
    }
  }

  private play(): void {
    // Rejected when the browser won't play it (an iPhone in Low Power Mode, for one); the
    // poster and the play button stay.
    this.video()
      .nativeElement.play()
      .catch(() => undefined);
  }
}

/** False for visitors who ask for reduced motion or to save data. */
function autoplayWanted(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const reducedMotion =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  return !connection?.saveData && !reducedMotion;
}
