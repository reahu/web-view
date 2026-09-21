import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { LogoMarquee } from './logo-marquee';

describe('LogoMarquee', () => {
  let fixture: ComponentFixture<LogoMarquee>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoMarquee],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoMarquee);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('renders each company exactly once', () => {
    const companies = TestBed.inject(ContentService).companies();
    const links = [...el.querySelectorAll('.logo a')].map((a) => a.getAttribute('href'));
    expect(links).toEqual(companies.map((c) => `/business-portfolio/${c.slug}`));
  });

  it('uses company names, not slugs, as alt text', () => {
    const companies = TestBed.inject(ContentService).companies();
    const alts = [...el.querySelectorAll('.logo img')].map((img) => img.getAttribute('alt'));
    expect(alts).toEqual(companies.map((c) => c.logoAlt));
    alts.forEach((alt) => expect(alt).not.toMatch(/^[a-z0-9-]+$/));
  });

  it('staggers each logo with its index', () => {
    const logos = el.querySelectorAll<HTMLElement>('.logo');
    expect(logos[3].style.getPropertyValue('--i')).toBe('3');
  });

  it('stops and restarts from the toggle', async () => {
    const toggle = el.querySelector<HTMLButtonElement>('.toggle')!;

    toggle.click();
    await fixture.whenStable();
    expect(el.querySelector('.viewport')?.classList).toContain('is-stopped');
    expect(toggle.textContent?.trim()).toBe('Start scrolling');
  });
});
