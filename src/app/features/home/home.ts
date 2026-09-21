import { Component } from '@angular/core';
import { AboutIntro } from './sections/about-intro/about-intro';
import { HeroCarousel } from './sections/hero-carousel/hero-carousel';
import { LatestNews } from './sections/latest-news/latest-news';
import { LogoMarquee } from './sections/logo-marquee/logo-marquee';

@Component({
  imports: [HeroCarousel, AboutIntro, LogoMarquee, LatestNews],
  selector: 'rg-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
