import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileDrawer } from './mobile-drawer';

describe('MobileDrawer', () => {
  let fixture: ComponentFixture<MobileDrawer>;
  let component: MobileDrawer;
  let el: HTMLElement;
  let dismissals: number;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileDrawer],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileDrawer);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    dismissals = 0;
    component.dismissed.subscribe(() => dismissals++);
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
  });

  it('reflects the open state on the host', () => {
    expect(el.classList).toContain('is-open');
  });

  it('closes and emits on Escape', async () => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(component.open()).toBe(false);
    expect(el.classList).not.toContain('is-open');
    expect(dismissals).toBe(1);
  });

  it('closes from the close button', () => {
    el.querySelector<HTMLButtonElement>('.close')!.click();
    expect(component.open()).toBe(false);
    expect(dismissals).toBe(1);
  });

  it('closes on a backdrop click but not a panel click', () => {
    el.querySelector<HTMLElement>('.panel')!.click();
    expect(component.open()).toBe(true);

    el.click();
    expect(component.open()).toBe(false);
  });

  it('does not emit when already closed', () => {
    component.open.set(false);
    component.dismiss();
    expect(dismissals).toBe(0);
  });
});
