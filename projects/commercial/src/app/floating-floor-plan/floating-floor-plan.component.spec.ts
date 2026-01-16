import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingFloorPlanComponent } from './floating-floor-plan.component';

describe('FloatingFloorPlanComponent', () => {
  let component: FloatingFloorPlanComponent;
  let fixture: ComponentFixture<FloatingFloorPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingFloorPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingFloorPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
