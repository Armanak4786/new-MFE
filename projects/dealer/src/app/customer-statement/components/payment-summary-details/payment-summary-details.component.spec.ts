import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSummaryDetailsComponent } from './payment-summary-details.component';

describe('PaymentSummaryDetailsComponent', () => {
  let component: PaymentSummaryDetailsComponent;
  let fixture: ComponentFixture<PaymentSummaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSummaryDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
