import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { ContentService } from '@core/services/content.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'business-portfolio/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      inject(ContentService)
        .companies()
        .map(({ slug }) => ({ slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
