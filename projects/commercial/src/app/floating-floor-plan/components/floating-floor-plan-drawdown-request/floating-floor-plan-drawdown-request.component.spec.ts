import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingFloorPlanDrawdownRequestComponent } from './floating-floor-plan-drawdown-request.component';

describe('FloatingFloorPlanDrawdownRequestComponent', () => {
  let component: FloatingFloorPlanDrawdownRequestComponent;
  let fixture: ComponentFixture<FloatingFloorPlanDrawdownRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingFloorPlanDrawdownRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingFloorPlanDrawdownRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
