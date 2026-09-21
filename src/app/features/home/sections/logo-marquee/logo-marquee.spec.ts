import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoMarquee } from './logo-marquee';

describe('LogoMarquee', () => {
  let component: LogoMarquee;
  let fixture: ComponentFixture<LogoMarquee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoMarquee],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoMarquee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
