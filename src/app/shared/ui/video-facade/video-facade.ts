import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const YOUTUBE_ID = /^[\w-]{11}$/;

/**
 * Shows a poster and a play button; the YouTube player (and its scripts and cookies)
 * only loads after the user asks for it.
 */
@Component({
  imports: [NgOptimizedImage],
  selector: 'rg-video-facade',
  styleUrl: './video-facade.scss',
  templateUrl: './video-facade.html',
})
export class VideoFacade {
  readonly youtubeId = input.required<string>();
  /** Names the video for the play button and the iframe. */
  readonly title = input.required<string>();
  /** Local poster image (root-relative, 16:9). */
  readonly poster = input.required<string>();

  private readonly sanitizer = inject(DomSanitizer);
  protected readonly playing = signal(false);

  protected readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const id = this.youtubeId();
    if (!YOUTUBE_ID.test(id)) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
    );
  });
}
