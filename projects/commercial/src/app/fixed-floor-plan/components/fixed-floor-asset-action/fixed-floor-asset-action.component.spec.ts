import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedFloorAssetActionComponent } from './fixed-floor-asset-action.component';

describe('FixedFloorAssetActionComponent', () => {
  let component: FixedFloorAssetActionComponent;
  let fixture: ComponentFixture<FixedFloorAssetActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedFloorAssetActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedFloorAssetActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
