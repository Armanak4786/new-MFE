import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditlineDrawdownRequestDetailsComponent } from './creditline-drawdown-request-details.component';

describe('CreditlineDrawdownRequestDetailsComponent', () => {
  let component: CreditlineDrawdownRequestDetailsComponent;
  let fixture: ComponentFixture<CreditlineDrawdownRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditlineDrawdownRequestDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditlineDrawdownRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
