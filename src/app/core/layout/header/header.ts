import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { LangPathPipe } from '@core/i18n/lang-path-pipe';
import { TranslatePipe } from '@core/i18n/translate-pipe';
import { LOGO } from '@core/services/seo.service';
import { filter } from 'rxjs';
import { LanguageSwitch } from '../language-switch/language-switch';
import { MobileDrawer } from '../mobile-drawer/mobile-drawer';
import { NavMenu } from '../nav-menu/nav-menu';

@Component({
  imports: [
    NgOptimizedImage,
    RouterLink,
    MobileDrawer,
    NavMenu,
    LanguageSwitch,
    TranslatePipe,
    LangPathPipe,
  ],
  selector: 'rg-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  protected readonly logo = LOGO;
  protected readonly navOpen = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.navOpen.set(false));
  }
}
