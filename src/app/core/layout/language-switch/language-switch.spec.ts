import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { LanguageService } from '@core/i18n/language.service';
import { Language, languageByCode } from '@core/i18n/languages';
import { LanguageSwitch } from './language-switch';

@Component({ template: '' })
class Blank {}

describe('LanguageSwitch', () => {
  const setup = async (code: Language['code'], url: string) => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitch],
      providers: [provideRouter([{ path: '**', component: Blank }])],
    }).compileComponents();
    await TestBed.inject(LanguageService).use(languageByCode(code)!);
    const fixture = TestBed.createComponent(LanguageSwitch);
    await TestBed.inject(Router).navigateByUrl(url);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      el,
      menu: el.querySelector('details')!,
      summary: el.querySelector('summary')!,
      links: [...el.querySelectorAll('a')],
      current: el.querySelector<HTMLElement>('[aria-current="true"]')!,
    };
  };

  it('links the same page in every other language, each named in itself', async () => {
    const { links } = await setup('km', '/about');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/en/about', '/zh/about']);
    expect(links.map((link) => link.textContent?.trim())).toEqual(['English', '简体中文']);
    expect(links.map((link) => link.getAttribute('lang'))).toEqual(['en', 'zh-Hans']);
    expect(links.map((link) => link.getAttribute('hreflang'))).toEqual(['en', 'zh-Hans']);
  });

  it('marks the current language instead of linking it', async () => {
    const { current, links } = await setup('zh-Hans', '/zh/about');
    expect(current.tagName).toBe('SPAN');
    expect(current.textContent?.trim()).toBe('简体中文');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/about', '/en/about']);
  });

  it('shows the short name on the button and reads out the full one', async () => {
    const { summary } = await setup('en', '/en');
    expect(summary.querySelector('[aria-hidden="true"]:not(svg)')?.textContent).toBe('EN');
    expect(summary.querySelector('.visually-hidden')?.textContent?.trim()).toBe('Language English');
  });

  it('maps the home pages and keeps the query string', async () => {
    expect((await setup('km', '/')).links.map((link) => link.getAttribute('href'))).toEqual([
      '/en',
      '/zh',
    ]);
    TestBed.resetTestingModule();
    const { links } = await setup('en', '/en/contact-us?topic=quote');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/contact-us?topic=quote',
      '/zh/contact-us?topic=quote',
    ]);
  });

  it('switches within the app, then closes with focus back on the button', async () => {
    const { fixture, menu, summary, links } = await setup('km', '/about');
    menu.open = true;
    links[0].focus();
    links[0].click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/en/about');
    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(summary);
  });

  it('closes on Escape, returning focus to the button', async () => {
    const { el, menu, summary } = await setup('km', '/');
    menu.open = true;
    el.querySelector('a')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(summary);
  });

  it('closes on a click outside but not inside', async () => {
    const { menu, current } = await setup('km', '/');
    menu.open = true;
    current.click();
    expect(menu.open).toBe(true);

    document.body.click();
    expect(menu.open).toBe(false);
  });
});
