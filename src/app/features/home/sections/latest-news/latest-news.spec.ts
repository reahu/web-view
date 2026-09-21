import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LatestNews } from './latest-news';

describe('LatestNews', () => {
  let component: LatestNews;
  let fixture: ComponentFixture<LatestNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestNews],
    }).compileComponents();

    fixture = TestBed.createComponent(LatestNews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
