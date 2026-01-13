import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradeFinancialComponent } from './sole-trade-financial.component';

describe('SoleTradeFinancialComponent', () => {
  let component: SoleTradeFinancialComponent;
  let fixture: ComponentFixture<SoleTradeFinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeFinancialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
