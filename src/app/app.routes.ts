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
    path: 'about',
    title: $localize`:@@route.about.title:About us`,
    data: {
      description: $localize`:@@route.about.description:About Malin Koh Kong Peace Development, a sand dredging and supply company in Cambodia.`,
    },
    loadComponent: () => import('@features/about/about').then((m) => m.About),
  },
  {
    path: 'services',
    title: $localize`:@@route.services.title:Services`,
    data: {
      description: $localize`:@@route.services.description:How we dredge sand and supply it for construction projects of every kind.`,
    },
    loadComponent: () => import('@features/services/services').then((m) => m.Services),
  },
  {
    path: 'organisation',
    title: $localize`:@@route.organisation.title:Organisation structure`,
    data: {
      description: $localize`:@@route.organisation.description:Who leads Malin Koh Kong Peace Development and how its teams are organised.`,
    },
    loadComponent: () => import('@features/organisation/organisation').then((m) => m.Organisation),
  },
  {
    path: 'contact-us',
    title: $localize`:@@route.contact.title:Contact us`,
    data: {
      description: $localize`:@@route.contact.description:How to reach Malin Koh Kong Peace Development.`,
    },
    loadComponent: () => import('@features/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'privacy-policy',
    title: $localize`:@@route.privacy.title:Privacy policy`,
    data: {
      description: $localize`:@@route.privacy.description:How Malin Koh Kong Peace Development collects and uses personal information.`,
    },
    loadComponent: () => import('@features/legal/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: 'terms-of-use',
    title: $localize`:@@route.terms.title:Terms of use`,
    data: {
      description: $localize`:@@route.terms.description:The terms that apply when you use this website.`,
    },
    loadComponent: () => import('@features/legal/terms/terms').then((m) => m.Terms),
  },
  {
    // Prerendered to /404/index.html so nginx can serve it with a real 404 status.
    path: '404',
    title: $localize`:@@notFound.title:Page not found`,
    data: { noindex: true },
    loadComponent: () => import('@features/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: '**',
    title: $localize`:@@notFound.title:Page not found`,
    data: { noindex: true },
    loadComponent: () => import('@features/not-found/not-found').then((m) => m.NotFound),
  },
];
