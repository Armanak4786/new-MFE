import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditlineDrawdownRequestSubmitComponent } from './creditline-drawdown-request-submit.component';

describe('CreditlineDrawdownRequestSubmitComponent', () => {
  let component: CreditlineDrawdownRequestSubmitComponent;
  let fixture: ComponentFixture<CreditlineDrawdownRequestSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditlineDrawdownRequestSubmitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditlineDrawdownRequestSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
