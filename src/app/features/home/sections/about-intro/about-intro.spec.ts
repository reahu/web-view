import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutIntro } from './about-intro';

describe('AboutIntro', () => {
  let component: AboutIntro;
  let fixture: ComponentFixture<AboutIntro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutIntro],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutIntro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
