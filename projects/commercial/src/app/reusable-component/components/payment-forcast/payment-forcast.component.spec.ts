import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentForcastComponent } from './payment-forcast.component';

describe('PaymentForcastComponent', () => {
  let component: PaymentForcastComponent;
  let fixture: ComponentFixture<PaymentForcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentForcastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentForcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
