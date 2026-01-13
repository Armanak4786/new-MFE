import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradeBalanceInfoComponent } from './sole-trade-balance-info.component';

describe('SoleTradeBalanceInfoComponent', () => {
  let component: SoleTradeBalanceInfoComponent;
  let fixture: ComponentFixture<SoleTradeBalanceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeBalanceInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeBalanceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
