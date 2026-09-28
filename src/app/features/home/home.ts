import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LangPathPipe } from '@core/i18n/lang-path-pipe';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { TranslationKey } from '@core/i18n/translations';
import { CarouselPhoto, PhotoCarousel } from '@shared/ui/photo-carousel/photo-carousel';
import { QuoteCta } from '@shared/ui/quote-cta/quote-cta';
import { SectionHeading } from '@shared/ui/section-heading/section-heading';
import { VideoLoop } from '@shared/ui/video-loop/video-loop';

@Component({
  imports: [
    PhotoCarousel,
    RouterLink,
    SectionHeading,
    QuoteCta,
    TranslatePipe,
    LangPathPipe,
    VideoLoop,
  ],
  selector: 'rg-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  /** The hero's photos: the office first, then sand and minerals work in turn. */
  protected readonly photos: readonly CarouselPhoto[] = [
    { src: '/images/photos/hall.webp', width: 1280, height: 960, alt: 'home.hero.imageAlt' },
    photo('sand-bow', 'sand.bow.imageAlt'),
    photo('minerals-survey', 'minerals.survey.imageAlt'),
    photo('sand-bank', 'sand.bank.imageAlt'),
    photo('minerals-drilling', 'minerals.drilling.imageAlt'),
    photo('sand-deck', 'sand.deck.imageAlt'),
    photo('minerals-fieldwork', 'minerals.fieldwork.imageAlt'),
    photo('sand-moored', 'sand.moored.imageAlt'),
    photo('minerals-outcrop', 'minerals.outcrop.imageAlt'),
    photo('minerals-panning', 'minerals.panning.imageAlt'),
  ];
}

/** A field photo from public/images/photos, all cut to 960×720. */
function photo(name: string, alt: TranslationKey): CarouselPhoto {
  return { src: `/images/photos/${name}.webp`, width: 960, height: 720, alt };
}
