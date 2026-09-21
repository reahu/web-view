import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoFacade } from './video-facade';

describe('VideoFacade', () => {
  let fixture: ComponentFixture<VideoFacade>;
  let el: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(VideoFacade);
    el = fixture.nativeElement;
    fixture.componentRef.setInput('youtubeId', 'abcdefghijk');
    fixture.componentRef.setInput('title', 'Company film');
    fixture.componentRef.setInput('poster', '/images/placeholders/hero-1.webp');
    await fixture.whenStable();
  });

  it('shows a poster and a named play button, with no iframe', () => {
    expect(el.querySelector('iframe')).toBeNull();
    expect(el.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(el.querySelector('button')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Play video: Company film',
    );
  });

  it('loads the privacy-enhanced player on click', async () => {
    el.querySelector('button')!.click();
    await fixture.whenStable();

    const iframe = el.querySelector('iframe')!;
    expect(iframe.getAttribute('src')).toBe(
      'https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=1&rel=0',
    );
    expect(iframe.getAttribute('title')).toBe('Company film');
    expect(el.querySelector('button')).toBeNull();
  });

  it('refuses ids that are not YouTube ids', async () => {
    fixture.componentRef.setInput('youtubeId', 'x"><script>');
    await fixture.whenStable();

    const button = el.querySelector('button')!;
    expect(button.disabled).toBe(true);
    button.click();
    await fixture.whenStable();
    expect(el.querySelector('iframe')).toBeNull();
  });
});
