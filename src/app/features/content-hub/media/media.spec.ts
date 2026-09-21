import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MediaVideo } from '@core/models/media-video';
import { ContentService } from '@core/services/content.service';
import { Media } from './media';

const render = async (videos: MediaVideo[]) => {
  await TestBed.configureTestingModule({
    imports: [Media],
    providers: [
      provideRouter([]),
      { provide: ContentService, useValue: { videos: signal(videos) } },
    ],
  }).compileComponents();
  const fixture = TestBed.createComponent(Media);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
};

describe('Media', () => {
  it('shows an empty state instead of unverified embeds', async () => {
    const el = await render([]);
    expect(el.querySelector('rg-video-facade')).toBeNull();
    expect(el.querySelector('.empty')?.textContent).toContain('Videos will be published');
  });

  it('renders a facade per video', async () => {
    const el = await render([
      { id: 'a', youtubeId: 'abcdefghijk', title: 'Film A', poster: '/images/placeholders/hero-1.webp' },
      { id: 'b', youtubeId: 'bcdefghijkl', title: 'Film B', poster: '/images/placeholders/hero-2.webp' },
    ]);
    expect(el.querySelectorAll('rg-video-facade').length).toBe(2);
    expect(el.querySelector('iframe')).toBeNull();
  });
});
