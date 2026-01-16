import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssetlinkFacilityComponent } from './view-assetlink-facility.component';

describe('ViewAssetlinkFacilityComponent', () => {
  let component: ViewAssetlinkFacilityComponent;
  let fixture: ComponentFixture<ViewAssetlinkFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAssetlinkFacilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssetlinkFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
