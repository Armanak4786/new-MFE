import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetLinkSubfacilityComponent } from './asset-link-subfacility.component';

describe('AssetLinkSubfacilityComponent', () => {
  let component: AssetLinkSubfacilityComponent;
  let fixture: ComponentFixture<AssetLinkSubfacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetLinkSubfacilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetLinkSubfacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
