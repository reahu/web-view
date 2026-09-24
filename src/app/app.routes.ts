import { Routes } from '@angular/router';
import { ORGANIZATION_JSON_LD, SITE_NAME } from '@core/services/seo.service';

// `data.description` feeds the meta description and `data.jsonLd` the structured data
// (see SeoTitleStrategy).
export const routes: Routes = [
  {
    path: '',
    title: SITE_NAME,
    data: { jsonLd: ORGANIZATION_JSON_LD },
    loadComponent: () => import('@features/home/home').then((m) => m.Home),
  },
  {
    path: 'contact-us',
    title: 'Contact us',
    data: { description: 'How to reach Royal Group of Cambodia in Phnom Penh.' },
    loadComponent: () => import('@features/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'privacy-policy',
    title: 'Privacy policy',
    data: { description: 'How Royal Group of Cambodia collects and uses personal information.' },
    loadComponent: () => import('@features/legal/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: 'terms-of-use',
    title: 'Terms of use',
    data: { description: 'The terms that apply when you use this website.' },
    loadComponent: () => import('@features/legal/terms/terms').then((m) => m.Terms),
  },
  {
    // Prerendered to /404/index.html so nginx can serve it with a real 404 status.
    path: '404',
    title: 'Page not found',
    data: { noindex: true },
    loadComponent: () => import('@features/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: '**',
    title: 'Page not found',
    data: { noindex: true },
    loadComponent: () => import('@features/not-found/not-found').then((m) => m.NotFound),
  },
];
