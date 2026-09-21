import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { CompanyDetail } from './company-detail';

describe('CompanyDetail', () => {
  let fixture: ComponentFixture<CompanyDetail>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyDetail],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyDetail);
    el = fixture.nativeElement;
  });

  it('shows the company, a breadcrumb and others in its sector', async () => {
    const content = TestBed.inject(ContentService);
    const company = content.companies()[0];
    const siblings = content.companies().filter(
      (c) => c.sector === company.sector && c.slug !== company.slug,
    );
    fixture.componentRef.setInput('slug', company.slug);
    await fixture.whenStable();

    expect(el.querySelector('h1')?.textContent).toContain(company.name);
    expect(el.querySelector('.breadcrumb [aria-current="page"]')?.textContent).toBe(company.name);
    const related = [...el.querySelectorAll('.related a')].map((a) => a.textContent);
    expect(related).toEqual(siblings.map((c) => c.name));
  });

  it('shows a not-found message for an unknown slug', async () => {
    fixture.componentRef.setInput('slug', 'does-not-exist');
    await fixture.whenStable();

    expect(el.querySelector('h1')?.textContent).toContain('Company not found');
    expect(el.querySelector('.breadcrumb')).toBeNull();
  });
});
