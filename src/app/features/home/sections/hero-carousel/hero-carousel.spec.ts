import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { HERO_INTERVAL_MS, HeroCarousel } from './hero-carousel';

describe('HeroCarousel', () => {
  let fixture: ComponentFixture<HeroCarousel>;
  let el: HTMLElement;
  let count: number;

  const slides = () => [...el.querySelectorAll<HTMLElement>('.slide')];
  const activeIndex = () => slides().findIndex((s) => s.classList.contains('is-active'));
  const button = (label: string) =>
    el.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;

  /**
   * Advance fake time, then a little more so the zoneless scheduler's own (faked)
   * timer fires and renders. whenStable() can't be used: autoplay always has a timer
   * pending.
   */
  const tick = async (ms: number) => {
    await vi.advanceTimersByTimeAsync(ms);
    await vi.advanceTimersByTimeAsync(50);
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [HeroCarousel],
      providers: [provideRouter([])],
    }).compileComponents();

    count = TestBed.inject(ContentService).slides().length;
    fixture = TestBed.createComponent(HeroCarousel);
    el = fixture.nativeElement;
    await tick(0);
  });

  afterEach(() => vi.useRealTimers());

  it('shows the first slide and makes the others inert', () => {
    expect(slides().length).toBe(count);
    expect(activeIndex()).toBe(0);
    slides()
      .slice(1)
      .forEach((slide) => expect(slide.inert).toBe(true));
    expect(slides()[0].getAttribute('aria-label')).toBe(`1 of ${count}`);
  });

  it('marks only the first image as priority (the LCP image)', () => {
    const images = el.querySelectorAll('img');
    expect(images[0].getAttribute('fetchpriority')).toBe('high');
    expect(images[1].getAttribute('loading')).toBe('lazy');
  });

  it('wraps with previous and next', async () => {
    button('Previous slide').click();
    await tick(0);
    expect(activeIndex()).toBe(count - 1);

    button('Next slide').click();
    await tick(0);
    expect(activeIndex()).toBe(0);
  });

  it('autoplays in the browser', async () => {
    await tick(HERO_INTERVAL_MS);
    expect(activeIndex()).toBe(1);
  });

  it('stops autoplay from the pause button', async () => {
    button('Pause slideshow').click();
    await tick(0);
    // Clicking focused nothing in jsdom, so only the pause button is holding it.
    await tick(HERO_INTERVAL_MS * 2);
    expect(activeIndex()).toBe(0);
    expect(button('Play slideshow')).toBeTruthy();
  });

  it('pauses while hovered and while a live region would be noisy', async () => {
    el.dispatchEvent(new MouseEvent('mouseenter'));
    await tick(HERO_INTERVAL_MS * 2);
    expect(activeIndex()).toBe(0);
    expect(el.querySelector('.slides')?.getAttribute('aria-live')).toBe('polite');

    el.dispatchEvent(new MouseEvent('mouseleave'));
    await tick(0);
    expect(el.querySelector('.slides')?.getAttribute('aria-live')).toBe('off');
    await tick(HERO_INTERVAL_MS);
    expect(activeIndex()).toBe(1);
  });

  it('jumps to a slide from its indicator', async () => {
    const dots = el.querySelectorAll<HTMLButtonElement>('.dot');
    dots[2].click();
    await tick(0);
    expect(activeIndex()).toBe(2);
    expect(dots[2].getAttribute('aria-current')).toBe('true');
    expect(dots[0].hasAttribute('aria-current')).toBe(false);
  });
});
