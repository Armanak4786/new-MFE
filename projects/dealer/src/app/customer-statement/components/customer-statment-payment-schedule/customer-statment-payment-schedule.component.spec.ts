import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStatmentPaymentScheduleComponent } from './customer-statment-payment-schedule.component';

describe('CustomerStatmentPaymentScheduleComponent', () => {
  let component: CustomerStatmentPaymentScheduleComponent;
  let fixture: ComponentFixture<CustomerStatmentPaymentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerStatmentPaymentScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerStatmentPaymentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
