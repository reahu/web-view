import { DOCUMENT } from '@angular/common';
import { InjectionToken, Injectable, Service, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { CONTACT_DETAILS } from '@content/contact';
import { LanguageService } from '@core/i18n/language.service';
import { LANGUAGES, languagePath, pagePath } from '@core/i18n/languages';
import { TranslationKey } from '@core/i18n/translations';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';

/** The brand in Latin script, as registered; the JSON-LD name on pages in every language. */
const BRAND_NAME = 'Malin Koh Kong Peace Development';

const LEGAL_NAME = 'Malin Koh Kong Peace Development Co., Ltd.';

/** A string in the page's language, by its key. */
export type Translate = (key: TranslationKey) => string;

/** Title suffix and og:site_name. */
const SITE_NAME: TranslationKey = 'site.name';

/** Header logo, from the client's organisation chart; also the JSON-LD logo (112px tall). */
export const LOGO = { src: '/images/logo/malin-logo.webp', width: 206, height: 112 };

const DEFAULT_DESCRIPTION: TranslationKey = 'seo.defaultDescription';

/** Default social preview: logo, both names and the values line on the brand green. */
const SHARE_IMAGE = {
  src: '/images/share/malin-share.webp',
  width: 1200,
  height: 630,
  alt: 'seo.shareImageAlt',
} as const;

/**
 * schema.org Organization for the home page, with its description in the page's language.
 * Only confirmed facts go here: structured data isn't visible, so a placeholder can't be
 * marked as one. Add email, foundingDate and sameAs once the client confirms them.
 */
export const organizationJsonLd = (t: Translate) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BRAND_NAME,
  legalName: LEGAL_NAME,
  // The client's own Khmer name, from the organisation chart.
  alternateName: 'ក្រុមហ៊ុន ម៉ាលីន កោះកុង ភីស ឌីវេឡុបមិន ឯ.ក',
  url: `${environment.site_url}/`,
  logo: `${environment.site_url}${LOGO.src}`,
  description: t(DEFAULT_DESCRIPTION),
  // In Latin script on every language's pages, like name. See CONTACT_DETAILS.
  address: {
    '@type': 'PostalAddress',
    streetAddress: '32, St. L02, Srok Chek Village, Sangkat Cheung Ek',
    postalCode: '12000',
    addressCountry: 'KH',
  },
  telephone: CONTACT_DETAILS.phone,
});

/**
 * False on local, dev and staging builds (environment.indexable): every page is noindex and
 * gets no language alternates, and tools/postbuild.mjs then writes no sitemap.
 */
export const SITE_INDEXABLE = new InjectionToken<boolean>('SITE_INDEXABLE', {
  providedIn: 'root',
  factory: () => environment.indexable,
});

/** A page's SEO, in the page's language. */
export interface PageSeo {
  /** Page name without the site suffix; empty or undefined for the home page. */
  title?: string;
  description?: string;
  /**
   * Root-relative path of the page without its language prefix, e.g. '/csr'. Query and
   * fragment are dropped.
   */
  path: string;
  /** Root-relative image path for social previews. */
  image?: string;
  noindex?: boolean;
  /** schema.org structured data; pages without it get none. */
  jsonLd?: object;
}

/**
 * Writes the document title, meta description, canonical link, language alternates,
 * Open Graph tags and JSON-LD, for the page in the current language.
 */
@Service()
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly translateService = inject(TranslateService);
  private readonly language = inject(LanguageService).current;
  private readonly indexable = inject(SITE_INDEXABLE);

  readonly translate: Translate = (key) => this.translateService.instant(key) as string;

  apply(page: PageSeo): void {
    const siteName = this.translate(SITE_NAME);
    const title = page.title && page.title !== siteName ? `${page.title} | ${siteName}` : siteName;
    const description = page.description || this.translate(DEFAULT_DESCRIPTION);
    const url = this.pageUrl(page.path);
    const image = absoluteUrl(page.image ?? SHARE_IMAGE.src);
    const noindex = page.noindex || !this.indexable;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: noindex ? 'noindex' : 'index, follow' });

    this.meta.updateTag({ property: 'og:site_name', content: siteName });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    if (page.image) {
      // Size and description are only known for the default image.
      for (const property of ['og:image:width', 'og:image:height', 'og:image:alt']) {
        this.meta.removeTag(`property="${property}"`);
      }
    } else {
      this.meta.updateTag({ property: 'og:image:width', content: String(SHARE_IMAGE.width) });
      this.meta.updateTag({ property: 'og:image:height', content: String(SHARE_IMAGE.height) });
      this.meta.updateTag({ property: 'og:image:alt', content: this.translate(SHARE_IMAGE.alt) });
    }
    this.meta.updateTag({ property: 'og:locale', content: this.language().ogLocale });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    this.setCanonical(url);
    this.setAlternates(noindex ? undefined : page.path);
    this.setJsonLd(page.jsonLd);
  }

  /**
   * <link rel="alternate" hreflang> for the page in every language, plus x-default (Khmer).
   * Omitted on noindex pages. tools/postbuild.mjs checks each pair points both ways.
   */
  private setAlternates(path: string | undefined): void {
    for (const link of this.document.head.querySelectorAll('link[rel="alternate"][hreflang]')) {
      link.remove();
    }
    if (path === undefined) {
      return;
    }
    const page = path.split(/[?#]/, 1)[0] || '/';
    const alternates = [
      ...LANGUAGES.map((language) => [language.code, language] as const),
      ['x-default', LANGUAGES[0]] as const,
    ];
    for (const [hreflang, language] of alternates) {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', absoluteUrl(languagePath(language, page)));
      this.document.head.appendChild(link);
    }
  }

  /**
   * Absolute URL of a page in the current language ("/en/…"). No trailing slash, so the
   * English home page is "/en", like every other page and like the route list the sitemap
   * is built from.
   */
  private pageUrl(path: string): string {
    return absoluteUrl(languagePath(this.language(), path.split(/[?#]/, 1)[0] || '/'));
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
 * Applies SEO on every navigation from the route's `title` and its `data`: `description`
 * (both translation keys), `noindex` (boolean) and `jsonLd` (a function of `Translate`, like
 * organizationJsonLd).
 */
@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let leaf = snapshot.root;
    while (leaf.firstChild) {
      leaf = leaf.firstChild;
    }
    const t = this.seo.translate;
    const title = this.buildTitle(snapshot) as TranslationKey | undefined;
    const description = leaf.data['description'] as TranslationKey | undefined;
    const jsonLd = leaf.data['jsonLd'] as ((t: Translate) => object) | undefined;
    this.seo.apply({
      title: title && t(title),
      description: description && t(description),
      noindex: leaf.data['noindex'] === true,
      jsonLd: jsonLd?.(t),
      path: pagePath(snapshot.url),
    });
  }
}

function absoluteUrl(path: string): string {
  return `${environment.site_url}${path}`;
}
