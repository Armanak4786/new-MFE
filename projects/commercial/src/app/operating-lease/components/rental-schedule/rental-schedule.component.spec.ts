import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalScheduleComponent } from './rental-schedule.component';

describe('RentalScheduleComponent', () => {
  let component: RentalScheduleComponent;
  let fixture: ComponentFixture<RentalScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
