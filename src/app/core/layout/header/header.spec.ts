import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let el: HTMLElement;

  const toggle = () => el.querySelector<HTMLButtonElement>('.header__toggle')!;
  const drawer = () => el.querySelector<HTMLElement>('rg-mobile-drawer')!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    el = fixture.nativeElement;
    document.body.appendChild(el);
    await fixture.whenStable();
  });

  afterEach(() => el.remove());

  it('renders one banner landmark with a single nav instance', () => {
    expect(el.querySelectorAll('header').length).toBe(1);
    expect(el.querySelectorAll('nav').length).toBe(1);
  });

  it('opens the drawer from the menu toggle', async () => {
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(toggle().getAttribute('aria-controls')).toBe(drawer().id);

    toggle().click();
    await fixture.whenStable();

    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(drawer().classList).toContain('is-open');
  });

  it('returns focus to the toggle when the drawer is dismissed', async () => {
    toggle().click();
    await fixture.whenStable();

    drawer().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();

    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle());
  });
});
