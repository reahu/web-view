import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoLoop } from './video-loop';

describe('VideoLoop', () => {
  let fixture: ComponentFixture<VideoLoop>;
  let el: HTMLElement;
  let video: HTMLVideoElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VideoLoop] }).compileComponents();
    fixture = TestBed.createComponent(VideoLoop);
    fixture.componentRef.setInput('src', '/videos/sand-dredgers.mp4');
    fixture.componentRef.setInput('width', 848);
    fixture.componentRef.setInput('height', 464);
    fixture.componentRef.setInput('label', 'Sand-dredging barges');
    el = fixture.nativeElement;
    await fixture.whenStable();
    video = el.querySelector('video')!;

    // jsdom can't play media: stand in for the browser, which fires play and pause.
    vi.spyOn(video, 'paused', 'get').mockImplementation(() => video.dataset['paused'] !== 'no');
    vi.spyOn(video, 'play').mockImplementation(async () => {
      video.dataset['paused'] = 'no';
      video.dispatchEvent(new Event('play'));
    });
    vi.spyOn(video, 'pause').mockImplementation(() => {
      video.dataset['paused'] = 'yes';
      video.dispatchEvent(new Event('pause'));
    });
  });

  it('is a silent loop that downloads nothing until it plays, with its poster beside it', () => {
    expect(video.muted).toBe(true);
    expect(video.hasAttribute('loop')).toBe(true);
    expect(video.hasAttribute('playsinline')).toBe(true);
    expect(video.getAttribute('preload')).toBe('none');
    expect(video.getAttribute('poster')).toBe('/videos/sand-dredgers.webp');
    expect(video.querySelector('source')?.getAttribute('src')).toBe('/videos/sand-dredgers.mp4');
    expect(video.getAttribute('width')).toBe('848');
    expect(video.getAttribute('aria-label')).toBe('Sand-dredging barges');
  });

  it('stays paused where it can’t watch the screen, until the visitor presses play', async () => {
    const button = el.querySelector('button')!;
    expect(video.play).not.toHaveBeenCalled();
    expect(button.getAttribute('aria-label')).toBe('Play video');

    button.click();
    await fixture.whenStable();
    expect(video.play).toHaveBeenCalled();
    expect(button.getAttribute('aria-label')).toBe('Pause video');

    button.click();
    await fixture.whenStable();
    expect(video.pause).toHaveBeenCalled();
    expect(button.getAttribute('aria-label')).toBe('Play video');
  });
});
