import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideClientHydration, withI18nSupport } from '@angular/platform-browser';
import { SeoTitleStrategy } from '@core/services/seo.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
    provideHttpClient(withFetch()),
    // Without withI18nSupport, hydration skips every component with i18n blocks (every page)
    // and re-renders it in the browser: the content vanishes and reappears, shifting the layout.
    provideClientHydration(withI18nSupport()),
  ],
};
