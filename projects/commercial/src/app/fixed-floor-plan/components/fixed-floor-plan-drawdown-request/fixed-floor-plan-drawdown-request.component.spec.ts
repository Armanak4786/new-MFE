import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedFloorPlanDrawdownRequestComponent } from './fixed-floor-plan-drawdown-request.component';

describe('FixedFloorPlanDrawdownRequestComponent', () => {
  let component: FixedFloorPlanDrawdownRequestComponent;
  let fixture: ComponentFixture<FixedFloorPlanDrawdownRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedFloorPlanDrawdownRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedFloorPlanDrawdownRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
