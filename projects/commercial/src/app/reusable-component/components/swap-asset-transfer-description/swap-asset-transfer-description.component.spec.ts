import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapAssetTransferDescriptionComponent } from './swap-asset-transfer-description.component';

describe('SwapAssetTransferDescriptionComponent', () => {
  let component: SwapAssetTransferDescriptionComponent;
  let fixture: ComponentFixture<SwapAssetTransferDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwapAssetTransferDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwapAssetTransferDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
