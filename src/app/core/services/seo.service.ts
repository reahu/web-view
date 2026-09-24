import { DOCUMENT, Location } from '@angular/common';
import { Injectable, Service, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { environment } from '@env/environment';

export const SITE_NAME = 'Malin Koh Kong Peace Development';

const LEGAL_NAME = 'Malin Koh Kong Peace Development Co., Ltd.';

/** Header logo, from the client's organisation chart; also the JSON-LD logo (112px tall). */
export const LOGO = { src: '/images/logo/malin-logo.webp', width: 206, height: 112 };

const DEFAULT_DESCRIPTION =
  'Malin Koh Kong Peace Development dredges and supplies sand for construction projects of every kind, in support of Cambodia’s construction sector.';

// Placeholder until a real share image exists.
const DEFAULT_IMAGE = '/images/placeholders/hero-1.webp';

/**
 * schema.org Organization for the home page. Only confirmed facts go here: structured data
 * isn't visible, so a placeholder can't be marked as one. Add address, telephone, email,
 * foundingDate and sameAs once the client confirms them.
 */
export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  legalName: LEGAL_NAME,
  // The client's own Khmer name, from the organisation chart.
  alternateName: 'ក្រុមហ៊ុន ម៉ាលីន កោះកុង ភីស ឌីវេឡុបមិន ឯ.ក',
  url: `${environment.site_url}/`,
  logo: `${environment.site_url}${LOGO.src}`,
  description: DEFAULT_DESCRIPTION,
};

export interface PageSeo {
  /** Page name without the site suffix; empty or undefined for the home page. */
  title?: string;
  description?: string;
  /** Root-relative path of the page, e.g. '/csr'. Query and fragment are dropped. */
  path: string;
  /** Root-relative image path for social previews. */
  image?: string;
  noindex?: boolean;
  /** schema.org structured data; pages without it get none. */
  jsonLd?: object;
}

/** Writes the document title, meta description, canonical link, Open Graph tags and JSON-LD. */
@Service()
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);

  apply(page: PageSeo): void {
    const title = page.title && page.title !== SITE_NAME ? `${page.title} | ${SITE_NAME}` : SITE_NAME;
    const description = page.description || DEFAULT_DESCRIPTION;
    const url = this.pageUrl(page.path);
    const image = absoluteUrl(page.image ?? DEFAULT_IMAGE);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: page.noindex ? 'noindex' : 'index, follow' });

    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    this.setCanonical(url);
    this.setJsonLd(page.jsonLd);
  }

  /**
   * Absolute URL of a page in the current language: the base href supplies the language
   * prefix ("/en/…"). No trailing slash, so the English home page is "/en", like every
   * other page and like the route list the sitemap is built from.
   */
  private pageUrl(path: string): string {
    const external = this.location.prepareExternalUrl(path.split(/[?#]/, 1)[0] || '/');
    return absoluteUrl(external.length > 1 ? external.replace(/\/$/, '') : external);
  }

  private setJsonLd(data: object | undefined): void {
    let script = this.document.head.querySelector('script[type="application/ld+json"]');
    if (!data) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    // Escaping `<` keeps a "</script>" inside a value from closing the element.
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}

/**
 * Applies SEO on every navigation from the route's `title` and its `data`:
 * `description` (string), `noindex` (boolean) and `jsonLd` (object).
 */
@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let leaf = snapshot.root;
    while (leaf.firstChild) {
      leaf = leaf.firstChild;
    }
    this.seo.apply({
      title: this.buildTitle(snapshot),
      description: leaf.data['description'] as string | undefined,
      noindex: leaf.data['noindex'] === true,
      jsonLd: leaf.data['jsonLd'] as object | undefined,
      path: snapshot.url,
    });
  }
}

function absoluteUrl(path: string): string {
  return `${environment.site_url}${path}`;
}
