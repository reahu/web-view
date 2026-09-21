export interface HeroSlide {
  id: string;
  title: string;
  /** Root-relative path under /images. */
  image: string;
  /** Describes the photo; use '' only if the image is purely decorative. */
  imageAlt: string;
  ctaLabel: string;
  /** Internal route (starts with '/'). */
  ctaLink: string;
}
