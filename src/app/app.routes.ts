import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Company } from '@core/models/company';
import { ContentService } from '@core/services/content.service';
import { SITE_NAME } from '@core/services/seo.service';

const companyFor = (route: ActivatedRouteSnapshot): Company | undefined =>
  inject(ContentService)
    .companies()
    .find((company) => company.slug === route.paramMap.get('slug'));

// Slugs match the original royalgroup.com.kh URLs; don't rename them.
// `data.description` feeds the meta description (see SeoTitleStrategy).
export const routes: Routes = [
  {
    path: '',
    title: SITE_NAME,
    loadComponent: () => import('@features/home/home').then((m) => m.Home),
  },
  {
    path: 'about-royal-group',
    title: 'About Royal Group',
    data: { description: 'Who we are: the history, values and leadership of Royal Group of Cambodia.' },
    loadComponent: () => import('@features/who-we-are/about/about').then((m) => m.About),
  },
  {
    path: 'the-chairman',
    title: 'The Chairman',
    data: { description: 'A profile of the Chairman of Royal Group of Cambodia.' },
    loadComponent: () => import('@features/who-we-are/chairman/chairman').then((m) => m.Chairman),
  },
  {
    path: 'milestones',
    title: 'Milestones',
    data: { description: 'Key moments in the growth of Royal Group of Cambodia, year by year.' },
    loadComponent: () =>
      import('@features/who-we-are/milestones/milestones').then((m) => m.Milestones),
  },
  {
    path: 'business-portfolio',
    title: 'Business portfolio',
    data: { description: 'The companies of Royal Group of Cambodia, grouped by sector.' },
    loadComponent: () =>
      import('@features/portfolio/portfolio-list/portfolio-list').then((m) => m.PortfolioList),
  },
  {
    path: 'business-portfolio/:slug',
    title: (route) => companyFor(route)?.name ?? 'Company not found',
    resolve: { description: (route: ActivatedRouteSnapshot) => companyFor(route)?.summary ?? '' },
    loadComponent: () =>
      import('@features/portfolio/company-detail/company-detail').then((m) => m.CompanyDetail),
  },
  {
    path: 'investors',
    title: 'Investors',
    data: { description: 'Information for investors and partners in Royal Group of Cambodia.' },
    loadComponent: () => import('@features/investors/investors').then((m) => m.Investors),
  },
  {
    path: 'latest-news',
    title: 'Latest news',
    data: { description: 'News and announcements from Royal Group of Cambodia.' },
    loadComponent: () => import('@features/content-hub/news/news').then((m) => m.News),
  },
  {
    path: 'csr',
    title: 'Corporate social responsibility',
    data: { description: 'How Royal Group of Cambodia supports communities across the country.' },
    loadComponent: () => import('@features/content-hub/csr/csr').then((m) => m.Csr),
  },
  {
    path: 'media',
    title: 'Media',
    data: { description: 'Photos, videos and press resources from Royal Group of Cambodia.' },
    loadComponent: () => import('@features/content-hub/media/media').then((m) => m.Media),
  },
  {
    path: 'contact-us',
    title: 'Contact us',
    data: { description: 'How to reach Royal Group of Cambodia in Phnom Penh.' },
    loadComponent: () => import('@features/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'careers',
    title: 'Careers',
    data: { description: 'Jobs and careers across the companies of Royal Group of Cambodia.' },
    loadComponent: () => import('@features/legal/careers/careers').then((m) => m.Careers),
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
  { path: 'social', redirectTo: 'latest-news' },
  {
    path: '**',
    title: 'Page not found',
    data: { noindex: true },
    loadComponent: () => import('@features/not-found/not-found').then((m) => m.NotFound),
  },
];
