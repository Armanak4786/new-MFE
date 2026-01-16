import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAndLoanComponent } from './payment-and-loan.component';

describe('PaymentAndLoanComponent', () => {
  let component: PaymentAndLoanComponent;
  let fixture: ComponentFixture<PaymentAndLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentAndLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentAndLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
