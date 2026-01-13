import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPaymentAmountComponent } from './total-payment-amount.component';

describe('TotalPaymentAmountComponent', () => {
  let component: TotalPaymentAmountComponent;
  let fixture: ComponentFixture<TotalPaymentAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalPaymentAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalPaymentAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
