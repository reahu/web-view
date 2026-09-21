import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chairman } from './chairman';

describe('Chairman', () => {
  let component: Chairman;
  let fixture: ComponentFixture<Chairman>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chairman],
    }).compileComponents();

    fixture = TestBed.createComponent(Chairman);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
