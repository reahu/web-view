import { inject } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { LanguageService } from '@core/i18n/language.service';
import { LANGUAGES } from '@core/i18n/languages';
import { TranslationKey } from '@core/i18n/translations';
import { Translate, organizationJsonLd } from '@core/services/seo.service';

/**
 * A page. `title` (the browser tab) and `data.description` (the meta description) are
 * translation keys; `data.jsonLd` gives the structured data (see SeoTitleStrategy).
 */
interface Page extends Route {
  title?: TranslationKey;
  data?: { description?: TranslationKey; noindex?: boolean; jsonLd?: (t: Translate) => object };
}

const PAGES: Page[] = [
  {
    path: '',
    title: 'site.name',
    data: { jsonLd: organizationJsonLd },
    loadComponent: () => import('@features/home/home').then((m) => m.Home),
  },
  {
    path: 'about',
    title: 'route.about.title',
    data: {
      description: 'route.about.description',
    },
    loadComponent: () => import('@features/about/about').then((m) => m.About),
  },
  {
    path: 'services',
    title: 'route.services.title',
    data: {
      description: 'route.services.description',
    },
    loadComponent: () => import('@features/services/services').then((m) => m.Services),
  },
  {
    path: 'organisation',
    title: 'route.organisation.title',
    data: {
      description: 'route.organisation.description',
    },
    loadComponent: () => import('@features/organisation/organisation').then((m) => m.Organisation),
  },
  {
    path: 'contact-us',
    title: 'route.contact.title',
    data: {
      description: 'route.contact.description',
    },
    loadComponent: () => import('@features/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'privacy-policy',
    title: 'route.privacy.title',
    data: {
      description: 'route.privacy.description',
    },
    loadComponent: () => import('@features/legal/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: 'terms-of-use',
    title: 'route.terms.title',
    data: {
      description: 'route.terms.description',
    },
    loadComponent: () => import('@features/legal/terms/terms').then((m) => m.Terms),
  },
  {
    // Prerendered to /404/index.html (and /en/404/…) so nginx can serve it with a real 404
    // status.
    path: '404',
    title: 'notFound.title',
    data: { noindex: true },
    loadComponent: () => import('@features/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: '**',
    title: 'notFound.title',
    data: { noindex: true },
    loadComponent: () => import('@features/not-found/not-found').then((m) => m.NotFound),
  },
];

/**
 * Every page in every language: Khmer at the root, the others under their prefix
 * ('/en/about'). Entering a language's pages loads its strings before they show. The root
 * goes last, so it doesn't catch '/en/…'.
 */
export const routes: Routes = [...LANGUAGES]
  .sort((a, b) => b.prefix.length - a.prefix.length)
  .map((language) => ({
    path: language.prefix.slice(1),
    canActivate: [
      () =>
        inject(LanguageService)
          .use(language)
          .then(() => true),
    ],
    children: PAGES,
  }));
