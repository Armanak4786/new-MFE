import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedFloorPlanFacilityComponent } from './fixed-floor-plan-facility.component';

describe('FixedFloorPlanFacilityComponent', () => {
  let component: FixedFloorPlanFacilityComponent;
  let fixture: ComponentFixture<FixedFloorPlanFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedFloorPlanFacilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedFloorPlanFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
