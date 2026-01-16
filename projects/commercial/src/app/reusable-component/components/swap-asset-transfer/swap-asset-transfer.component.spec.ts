import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapAssetTransferComponent } from './swap-asset-transfer.component';

describe('SwapAssetTransferComponent', () => {
  let component: SwapAssetTransferComponent;
  let fixture: ComponentFixture<SwapAssetTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwapAssetTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwapAssetTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
