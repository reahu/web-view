import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { CompanyDetail } from './company-detail';

describe('CompanyDetail', () => {
  let fixture: ComponentFixture<CompanyDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyDetail],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyDetail);
  });

  it('shows the company for a known slug', async () => {
    const company = TestBed.inject(ContentService).companies()[0];
    fixture.componentRef.setInput('slug', company.slug);
    await fixture.whenStable();

    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(h1?.textContent).toContain(company.name);
  });

  it('shows a not-found message for an unknown slug', async () => {
    fixture.componentRef.setInput('slug', 'does-not-exist');
    await fixture.whenStable();

    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(h1?.textContent).toContain('Company not found');
  });
});
