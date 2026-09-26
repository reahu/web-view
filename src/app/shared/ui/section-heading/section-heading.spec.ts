import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SectionHeading } from './section-heading';

describe('SectionHeading', () => {
  let fixture: ComponentFixture<SectionHeading>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHeading],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHeading);
    el = fixture.nativeElement;
    fixture.componentRef.setInput('heading', 'Latest news');
  });

  it('renders an h2 by default, h3 on request', async () => {
    await fixture.whenStable();
    expect(el.querySelector('h2')?.textContent).toBe('Latest news');

    fixture.componentRef.setInput('level', 3);
    await fixture.whenStable();
    expect(el.querySelector('h2')).toBeNull();
    expect(el.querySelector('h3')?.textContent).toBe('Latest news');
  });

  it('renders the link only when label and path are both set', async () => {
    fixture.componentRef.setInput('linkLabel', 'View all news');
    await fixture.whenStable();
    expect(el.querySelector('a')).toBeNull();

    fixture.componentRef.setInput('linkPath', '/latest-news');
    await fixture.whenStable();
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/latest-news');
  });

  it('omits the intro paragraph when not given', async () => {
    await fixture.whenStable();
    expect(el.querySelector('p')).toBeNull();
  });
});
