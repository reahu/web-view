import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { NavMenu } from './nav-menu';

@Component({ template: '' })
class Blank {}

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
    el = fixture.nativeElement;
    document.body.appendChild(el);
    await fixture.whenStable();
  });

  afterEach(() => el.remove());

  it('renders group parents as buttons wired to their lists', () => {
    const button = trigger('who-we-are');
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe('nav-group-who-we-are');
    expect(group('who-we-are').hidden).toBe(true);
  });

  it('never uses href="#"', () => {
    expect(el.querySelector('a[href="#"]')).toBeNull();
  });

  it('opens one group at a time', async () => {
    trigger('who-we-are').click();
    await fixture.whenStable();
    expect(trigger('who-we-are').getAttribute('aria-expanded')).toBe('true');
    expect(group('who-we-are').hidden).toBe(false);

    trigger('news-and-media').click();
    await fixture.whenStable();
    expect(group('who-we-are').hidden).toBe(true);
    expect(group('news-and-media').hidden).toBe(false);
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    trigger('who-we-are').click();
    await fixture.whenStable();
    group('who-we-are').querySelector('a')!.focus();

    group('who-we-are').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();

    expect(group('who-we-are').hidden).toBe(true);
    expect(document.activeElement).toBe(trigger('who-we-are'));
  });

  it('lets Escape bubble when no group is open', () => {
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    const stop = vi.spyOn(escape, 'stopPropagation');
    el.querySelector('nav')!.dispatchEvent(escape);
    expect(stop).not.toHaveBeenCalled();
  });

  it('closes when clicking outside', async () => {
    trigger('who-we-are').click();
    await fixture.whenStable();

    document.body.click();
    await fixture.whenStable();
    expect(group('who-we-are').hidden).toBe(true);
  });

  it('closes after navigating', async () => {
    trigger('who-we-are').click();
    await fixture.whenStable();

    await TestBed.inject(Router).navigateByUrl('/milestones');
    await fixture.whenStable();
    expect(group('who-we-are').hidden).toBe(true);
    expect(trigger('who-we-are').classList).toContain('is-active');
  });
});
