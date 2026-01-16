import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSettlementQuoteComponent } from './request-settlement-quote.component';

describe('RequestSettlementQuoteComponent', () => {
  let component: RequestSettlementQuoteComponent;
  let fixture: ComponentFixture<RequestSettlementQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestSettlementQuoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestSettlementQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
