import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { NavEntry } from '../navigation';
import { NavMenu } from './nav-menu';

@Component({ template: '' })
class Blank {}

/** The site's own menu may have no groups, so the disclosure behaviour is tested on this one. */
const TEST_NAV: readonly NavEntry[] = [
  {
    id: 'about',
    label: 'About',
    links: [
      { label: 'Company', path: '/company' },
      { label: 'People', path: '/people' },
    ],
  },
  { id: 'more', label: 'More', links: [{ label: 'Other', path: '/other' }] },
  { label: 'Contact', path: '/contact' },
];

describe('NavMenu', () => {
  let fixture: ComponentFixture<NavMenu>;
  let el: HTMLElement;

  const trigger = (id: string) => el.querySelector<HTMLButtonElement>(`#nav-trigger-${id}`)!;
  const group = (id: string) => el.querySelector<HTMLElement>(`#nav-group-${id}`)!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavMenu],
      providers: [provideRouter([{ path: '**', component: Blank }])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavMenu);
    fixture.componentRef.setInput('entries', TEST_NAV);
    el = fixture.nativeElement;
    document.body.appendChild(el);
    await fixture.whenStable();
  });

  afterEach(() => el.remove());

  it('renders group parents as buttons wired to their lists', () => {
    const button = trigger('about');
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe('nav-group-about');
    expect(group('about').hidden).toBe(true);
  });

  it('never uses href="#"', () => {
    expect(el.querySelector('a[href="#"]')).toBeNull();
  });

  it('opens one group at a time', async () => {
    trigger('about').click();
    await fixture.whenStable();
    expect(trigger('about').getAttribute('aria-expanded')).toBe('true');
    expect(group('about').hidden).toBe(false);

    trigger('more').click();
    await fixture.whenStable();
    expect(group('about').hidden).toBe(true);
    expect(group('more').hidden).toBe(false);
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    trigger('about').click();
    await fixture.whenStable();
    group('about').querySelector('a')!.focus();

    group('about').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();

    expect(group('about').hidden).toBe(true);
    expect(document.activeElement).toBe(trigger('about'));
  });

  it('lets Escape bubble when no group is open', () => {
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    const stop = vi.spyOn(escape, 'stopPropagation');
    el.querySelector('nav')!.dispatchEvent(escape);
    expect(stop).not.toHaveBeenCalled();
  });

  it('closes when clicking outside', async () => {
    trigger('about').click();
    await fixture.whenStable();

    document.body.click();
    await fixture.whenStable();
    expect(group('about').hidden).toBe(true);
  });

  it('closes after navigating', async () => {
    trigger('about').click();
    await fixture.whenStable();

    await TestBed.inject(Router).navigateByUrl('/people');
    await fixture.whenStable();
    expect(group('about').hidden).toBe(true);
    expect(trigger('about').classList).toContain('is-active');
  });
});
