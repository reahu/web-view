import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MAIN_NAV, isNavGroup } from '../navigation';
import { Footer } from './footer';

describe('Footer', () => {
  let fixture: ComponentFixture<Footer>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('shows the current year', () => {
    expect(el.textContent).toContain(`© ${new Date().getFullYear()} Malin Koh Kong Peace Development Co., Ltd.`);
  });

  it('links to every page in the main navigation', () => {
    const hrefs = [...el.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    const paths = MAIN_NAV.flatMap((entry) => (isNavGroup(entry) ? entry.links : [entry])).map(
      (link) => link.path,
    );
    for (const path of paths) {
      expect(hrefs).toContain(path);
    }
  });

  it('links to the legal pages instead of opening them in modals', () => {
    const hrefs = [...el.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/privacy-policy');
    expect(hrefs).toContain('/terms-of-use');
  });
});
