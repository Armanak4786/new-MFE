import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTradeComponent } from './sole-trade.component';

describe('SoleTradeComponent', () => {
  let component: SoleTradeComponent;
  let fixture: ComponentFixture<SoleTradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTradeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
