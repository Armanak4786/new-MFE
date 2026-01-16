import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSummaryAccountForcastComponent } from './payment-summary-account-forcast.component';

describe('PaymentSummaryAccountForcastComponent', () => {
  let component: PaymentSummaryAccountForcastComponent;
  let fixture: ComponentFixture<PaymentSummaryAccountForcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSummaryAccountForcastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSummaryAccountForcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
