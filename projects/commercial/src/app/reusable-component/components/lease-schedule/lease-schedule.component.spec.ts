import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseScheduleComponent } from './lease-schedule.component';

describe('LeaseScheduleComponent', () => {
  let component: LeaseScheduleComponent;
  let fixture: ComponentFixture<LeaseScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaseScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaseScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
