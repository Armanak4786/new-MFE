import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityAssetsComponent } from './facility-assets.component';

describe('FacilityAssetsComponent', () => {
  let component: FacilityAssetsComponent;
  let fixture: ComponentFixture<FacilityAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityAssetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
