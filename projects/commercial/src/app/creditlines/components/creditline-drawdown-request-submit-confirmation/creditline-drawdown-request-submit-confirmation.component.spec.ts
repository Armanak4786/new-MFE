import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditlineDrawdownRequestSubmitConfirmationComponent } from './creditline-drawdown-request-submit-confirmation.component';

describe('CreditlineDrawdownRequestSubmitConfirmationComponent', () => {
  let component: CreditlineDrawdownRequestSubmitConfirmationComponent;
  let fixture: ComponentFixture<CreditlineDrawdownRequestSubmitConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditlineDrawdownRequestSubmitConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditlineDrawdownRequestSubmitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
