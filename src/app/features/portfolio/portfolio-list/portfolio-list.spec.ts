import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SECTORS } from '@core/models/company';
import { ContentService } from '@core/services/content.service';
import { PortfolioList } from './portfolio-list';

describe('PortfolioList', () => {
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioList],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(PortfolioList);
    await fixture.whenStable();
    el = fixture.nativeElement;
  });

  it('renders a section per sector in site order, with fragment ids', () => {
    const ids = [...el.querySelectorAll('section.sector')].map((s) => s.id);
    const withCompanies = new Set(TestBed.inject(ContentService).companies().map((c) => c.sector));
    expect(ids).toEqual(SECTORS.filter((s) => withCompanies.has(s)));
  });

  it('links every company to its detail page', () => {
    const hrefs = [...el.querySelectorAll('.company h3 a')].map((a) => a.getAttribute('href'));
    const slugs = TestBed.inject(ContentService).companies().map((c) => `/business-portfolio/${c.slug}`);
    expect([...hrefs].sort()).toEqual([...slugs].sort());
  });
});
