import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselPhoto, PhotoCarousel } from './photo-carousel';

const PHOTOS: CarouselPhoto[] = [
  { src: '/images/photos/hall.webp', width: 1280, height: 960, alt: 'home.hero.imageAlt' },
  { src: '/images/photos/sand-bow.webp', width: 960, height: 720, alt: 'sand.bow.imageAlt' },
  {
    src: '/images/photos/minerals-survey.webp',
    width: 960,
    height: 720,
    alt: 'minerals.survey.imageAlt',
  },
  { src: '/images/photos/sand-bank.webp', width: 960, height: 720, alt: 'sand.bank.imageAlt' },
  {
    src: '/images/photos/minerals-drilling.webp',
    width: 960,
    height: 720,
    alt: 'minerals.drilling.imageAlt',
  },
];

describe('PhotoCarousel', () => {
  let fixture: ComponentFixture<PhotoCarousel>;
  let el: HTMLElement;

  async function create(): Promise<void> {
    await TestBed.configureTestingModule({ imports: [PhotoCarousel] }).compileComponents();
    fixture = TestBed.createComponent(PhotoCarousel);
    fixture.componentRef.setInput('photos', PHOTOS);
    fixture.componentRef.setInput('label', 'Photos of our office and our work');
    fixture.componentRef.setInput('priority', true);
    el = fixture.nativeElement;
  }

  /** The photo in the middle, as its src. */
  function current(): string | null | undefined {
    return el.querySelector('.slide--current img')?.getAttribute('src');
  }

  /** Where each photo sits, in order: 0 in the middle, -1 and 1 either side. */
  function places(): string[] {
    return [...el.querySelectorAll<HTMLElement>('.slide')].map((slide) =>
      slide.style.getPropertyValue('--offset'),
    );
  }

  /** A mouse press on an element, released after moving from one x to another. */
  async function press(selector: string, from: number, to: number): Promise<void> {
    const target = el.querySelector(selector)!;
    const init = { bubbles: true, isPrimary: true, button: 0 };
    target.dispatchEvent(new PointerEvent('pointerdown', { ...init, clientX: from }));
    target.dispatchEvent(new PointerEvent('pointerup', { ...init, clientX: to }));
    await settle();
  }

  // Replaced below, where fake timers would keep whenStable() waiting for ever.
  let settle = () => fixture.whenStable();

  describe('by hand', () => {
    beforeEach(async () => {
      await create();
      await settle();
    });

    it('is a labelled region showing the first photo, loaded first, with its neighbours either side', () => {
      expect(el.getAttribute('role')).toBe('region');
      expect(el.getAttribute('aria-label')).toBe('Photos of our office and our work');
      expect(current()).toContain('/images/photos/hall.webp');
      expect(el.querySelector('.slide--current img')?.getAttribute('fetchpriority')).toBe('high');
      expect(places()).toEqual(['0', '1', '2', '-2', '-1']);
      expect([...el.querySelectorAll('img')].map((img) => img.getAttribute('alt'))).toEqual([
        'The reception hall at the company’s office',
        'The bow of a sand-dredging barge, with its pumps and suction hose',
        'A team inspecting a site for mineral exploration',
        'A sand-dredging barge moored along the riverbank',
        'A drilling rig at a mineral exploration site',
      ]);
    });

    it('lets screen readers see only the photo in the middle, and says which one it is', () => {
      const slides = [...el.querySelectorAll('.slide')];
      expect(slides.map((slide) => slide.getAttribute('aria-hidden'))).toEqual([
        null,
        'true',
        'true',
        'true',
        'true',
      ]);
      expect(slides[0].getAttribute('role')).toBe('group');
      expect(slides[0].getAttribute('aria-label')).toBe('Photo 1 of 5');
    });

    it('has no buttons, and nothing else to tab to', () => {
      expect(el.querySelectorAll('button, a, [tabindex]').length).toBe(0);
    });

    it('moves on with a swipe to the left and back with one to the right, round the ends', async () => {
      await press('.track', 100, 300);
      expect(current()).toContain('/images/photos/minerals-drilling.webp');
      expect(places()).toEqual(['1', '2', '-2', '-1', '0']);
      await press('.track', 300, 100);
      await press('.track', 300, 100);
      expect(current()).toContain('/images/photos/sand-bow.webp');
    });

    it('brings a neighbour to the middle when it’s clicked, and takes no notice of a short drag', async () => {
      await press('.slide--current', 300, 280);
      expect(current()).toContain('/images/photos/hall.webp');
      await press('.slide:nth-child(2)', 100, 102);
      expect(current()).toContain('/images/photos/sand-bow.webp');
    });
  });

  describe('by itself', () => {
    beforeEach(async () => {
      vi.useFakeTimers();
      settle = async () => fixture.detectChanges();
      await create();
      await settle();
    });

    afterEach(() => {
      vi.useRealTimers();
      settle = () => fixture.whenStable();
    });

    async function wait(ms: number): Promise<void> {
      await vi.advanceTimersByTimeAsync(ms);
      fixture.detectChanges();
    }

    it('moves on every six seconds, without announcing it to screen readers', async () => {
      expect(el.querySelector('[aria-live]')).toBeNull();
      await wait(5900);
      expect(current()).toContain('/images/photos/hall.webp');
      await wait(100);
      expect(current()).toContain('/images/photos/sand-bow.webp');
    });

    it('waits while a mouse is over it, then goes on; a tap doesn’t make it wait', async () => {
      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
      await wait(20000);
      expect(current()).toContain('/images/photos/hall.webp');

      el.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }));
      await wait(6000);
      expect(current()).toContain('/images/photos/sand-bow.webp');
    });
  });
});
