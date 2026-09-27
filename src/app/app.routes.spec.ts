import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SeoTitleStrategy } from '@core/services/seo.service';
import { routes } from './app.routes';

describe('routes', () => {
  let harness: RouterTestingHarness;

  const heading = () => harness.routeNativeElement?.querySelector('h1')?.textContent?.trim();
  const lang = () => TestBed.inject(DOCUMENT).documentElement.getAttribute('lang');

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), { provide: TitleStrategy, useClass: SeoTitleStrategy }],
    });
    harness = await RouterTestingHarness.create();
  });

  it('shows each page in the language of its URL prefix, Khmer at the root', async () => {
    await harness.navigateByUrl('/about');
    expect(heading()).toBe('អំពីយើង');
    expect(lang()).toBe('km');

    await harness.navigateByUrl('/en/about');
    expect(heading()).toBe('About us');
    expect(lang()).toBe('en');

    await harness.navigateByUrl('/zh/about');
    expect(heading()).toBe('关于我们');
    expect(lang()).toBe('zh-Hans');
  });

  it('titles the page in its language', async () => {
    await harness.navigateByUrl('/en/services');
    expect(TestBed.inject(Title).getTitle()).toBe('Services | Malin Koh Kong Peace Development');

    await harness.navigateByUrl('/services');
    expect(TestBed.inject(Title).getTitle()).toBe('សេវាកម្ម | ម៉ាលីន កោះកុង ភីស ឌីវេឡុបមិន');
  });

  it('shows unknown pages as not found, in the language of the URL', async () => {
    await harness.navigateByUrl('/en/nope');
    expect(heading()).toBe('Page not found');

    await harness.navigateByUrl('/nope');
    expect(heading()).toBe('រកមិនឃើញទំព័រ');
  });
});
