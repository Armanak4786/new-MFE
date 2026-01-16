import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditlineDrawdownRequestCardComponent } from './creditline-drawdown-request-card.component';

describe('CreditlineDrawdownRequestCardComponent', () => {
  let component: CreditlineDrawdownRequestCardComponent;
  let fixture: ComponentFixture<CreditlineDrawdownRequestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditlineDrawdownRequestCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditlineDrawdownRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
