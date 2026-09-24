import { APP_BASE_HREF } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';

@Component({ template: '<h1>Test page</h1>' })
class TestPage {}

describe('App', () => {
  const setup = (baseHref: string) =>
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([{ path: '**', component: TestPage }]),
        { provide: APP_BASE_HREF, useValue: baseHref },
      ],
    }).compileComponents();

  beforeEach(() => setup('/'));

  it('renders the landmarks in order', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const landmarks = [...el.querySelectorAll('header, main, footer')].map((n) => n.tagName);
    expect(landmarks).toEqual(['HEADER', 'MAIN', 'FOOTER']);
    expect(el.firstElementChild?.classList).toContain('skip-link');
  });

  it('points the skip link at the current page, not /#main', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/csr?ref=x');
    await fixture.whenStable();

    const skip = (fixture.nativeElement as HTMLElement).querySelector('.skip-link');
    expect(skip?.getAttribute('href')).toBe('/csr#main');
  });

  it('keeps the language prefix in the skip link on English pages', async () => {
    TestBed.resetTestingModule();
    await setup('/en/');
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/csr');
    await fixture.whenStable();

    const skip = (fixture.nativeElement as HTMLElement).querySelector('.skip-link');
    expect(skip?.getAttribute('href')).toBe('/en/csr#main');
  });

  it('moves focus to main from the skip link', async () => {
    const fixture = TestBed.createComponent(App);
    const el: HTMLElement = fixture.nativeElement;
    document.body.appendChild(el);
    await fixture.whenStable();

    el.querySelector<HTMLAnchorElement>('.skip-link')!.click();
    expect(document.activeElement?.id).toBe('main');
    el.remove();
  });
});
