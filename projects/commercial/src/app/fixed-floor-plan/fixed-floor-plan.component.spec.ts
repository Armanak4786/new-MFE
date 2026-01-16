import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedFloorPlanComponent } from './fixed-floor-plan.component';

describe('FixedFloorPlanComponent', () => {
  let component: FixedFloorPlanComponent;
  let fixture: ComponentFixture<FixedFloorPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedFloorPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedFloorPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
