import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestPaymentForcastComponent } from './interest-payment-forcast.component';

describe('InterestPaymentForcastComponent', () => {
  let component: InterestPaymentForcastComponent;
  let fixture: ComponentFixture<InterestPaymentForcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestPaymentForcastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestPaymentForcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
