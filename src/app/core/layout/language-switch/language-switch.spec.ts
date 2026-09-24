import { Component, LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { LanguageSwitch } from './language-switch';

@Component({ template: '' })
class Blank {}

describe('LanguageSwitch', () => {
  const setup = async (locale: string, url: string) => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitch],
      providers: [
        provideRouter([{ path: '**', component: Blank }]),
        { provide: LOCALE_ID, useValue: locale },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(LanguageSwitch);
    await TestBed.inject(Router).navigateByUrl(url);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('a')!;
  };

  it('links Khmer pages to the same page in English, named in English', async () => {
    const link = await setup('km', '/about');
    expect(link.getAttribute('href')).toBe('/en/about');
    expect(link.textContent?.trim()).toBe('English');
    expect(link.getAttribute('lang')).toBe('en');
    expect(link.getAttribute('hreflang')).toBe('en');
  });

  it('links English pages to the same page in Khmer, named in Khmer', async () => {
    const link = await setup('en', '/about');
    expect(link.getAttribute('href')).toBe('/about');
    expect(link.textContent?.trim()).toBe('ខ្មែរ');
    expect(link.getAttribute('lang')).toBe('km');
  });

  it('maps the home pages and keeps the query string', async () => {
    expect((await setup('km', '/')).getAttribute('href')).toBe('/en');
    TestBed.resetTestingModule();
    expect((await setup('en', '/contact-us?topic=quote')).getAttribute('href')).toBe(
      '/contact-us?topic=quote',
    );
  });
});
