import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePaymentViewRequestComponent } from './purchase-payment-view-request.component';

describe('PurchasePaymentViewRequestComponent', () => {
  let component: PurchasePaymentViewRequestComponent;
  let fixture: ComponentFixture<PurchasePaymentViewRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasePaymentViewRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasePaymentViewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
