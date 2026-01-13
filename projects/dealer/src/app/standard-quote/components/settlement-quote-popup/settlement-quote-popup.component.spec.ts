import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementQuotePopupComponent } from './settlement-quote-popup.component';

describe('SettlementQuotePopupComponent', () => {
  let component: SettlementQuotePopupComponent;
  let fixture: ComponentFixture<SettlementQuotePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettlementQuotePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettlementQuotePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
