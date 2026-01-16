import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiScheduleComponent } from './pi-schedule.component';

describe('PiScheduleComponent', () => {
  let component: PiScheduleComponent;
  let fixture: ComponentFixture<PiScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
