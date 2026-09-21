import { Routes } from '@angular/router';

// Slugs match the original royalgroup.com.kh URLs; don't rename them.
export const routes: Routes = [
  {
    path: '',
    title: 'Royal Group of Cambodia',
    loadComponent: () => import('@features/home/home').then((m) => m.Home),
  },
  {
    path: 'about-royal-group',
    title: 'About Royal Group',
    loadComponent: () => import('@features/who-we-are/about/about').then((m) => m.About),
  },
  {
    path: 'the-chairman',
    title: 'The Chairman',
    loadComponent: () => import('@features/who-we-are/chairman/chairman').then((m) => m.Chairman),
  },
  {
    path: 'milestones',
    title: 'Milestones',
    loadComponent: () =>
      import('@features/who-we-are/milestones/milestones').then((m) => m.Milestones),
  },
  {
    path: 'business-portfolio',
    title: 'Business portfolio',
    loadComponent: () =>
      import('@features/portfolio/portfolio-list/portfolio-list').then((m) => m.PortfolioList),
  },
  {
    path: 'business-portfolio/:slug',
    loadComponent: () =>
      import('@features/portfolio/company-detail/company-detail').then((m) => m.CompanyDetail),
  },
  {
    path: 'investors',
    title: 'Investors',
    loadComponent: () => import('@features/investors/investors').then((m) => m.Investors),
  },
  {
    path: 'latest-news',
    title: 'Latest news',
    loadComponent: () => import('@features/content-hub/news/news').then((m) => m.News),
  },
  {
    path: 'csr',
    title: 'Corporate social responsibility',
    loadComponent: () => import('@features/content-hub/csr/csr').then((m) => m.Csr),
  },
  {
    path: 'media',
    title: 'Media',
    loadComponent: () => import('@features/content-hub/media/media').then((m) => m.Media),
  },
  {
    path: 'contact-us',
    title: 'Contact us',
    loadComponent: () => import('@features/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'careers',
    title: 'Careers',
    loadComponent: () => import('@features/legal/careers/careers').then((m) => m.Careers),
  },
  {
    path: 'privacy-policy',
    title: 'Privacy policy',
    loadComponent: () => import('@features/legal/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: 'terms-of-use',
    title: 'Terms of use',
    loadComponent: () => import('@features/legal/terms/terms').then((m) => m.Terms),
  },
  { path: 'social', redirectTo: 'latest-news' },
  {
    path: '**',
    title: 'Page not found',
    loadComponent: () => import('@features/not-found/not-found').then((m) => m.NotFound),
  },
];
