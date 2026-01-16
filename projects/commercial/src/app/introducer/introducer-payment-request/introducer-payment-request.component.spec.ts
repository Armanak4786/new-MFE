import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroducerPaymentRequestComponent } from './introducer-payment-request.component';

describe('IntroducerPaymentRequestComponent', () => {
  let component: IntroducerPaymentRequestComponent;
  let fixture: ComponentFixture<IntroducerPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroducerPaymentRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroducerPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
