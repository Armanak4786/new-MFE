import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroducerPaymentTabPopUpComponent } from './introducer-payment-tab-pop-up.component';

describe('IntroducerPaymentTabPopUpComponent', () => {
  let component: IntroducerPaymentTabPopUpComponent;
  let fixture: ComponentFixture<IntroducerPaymentTabPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntroducerPaymentTabPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroducerPaymentTabPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
