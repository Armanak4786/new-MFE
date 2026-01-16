import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAssetRequestComponent } from './purchase-asset-request.component';

describe('PurchaseAssetRequestComponent', () => {
  let component: PurchaseAssetRequestComponent;
  let fixture: ComponentFixture<PurchaseAssetRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseAssetRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseAssetRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
