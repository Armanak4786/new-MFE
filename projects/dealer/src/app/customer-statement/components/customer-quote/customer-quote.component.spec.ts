import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerQuoteComponent } from './customer-quote.component';

describe('PaymentSummaryDetailsComponent', () => {
  let component: CustomerQuoteComponent;
  let fixture: ComponentFixture<CustomerQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerQuoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
