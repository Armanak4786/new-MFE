import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuybackRentalSummaryComponent } from './buyback-rental-summary.component';

describe('BuybackRentalSummaryComponent', () => {
  let component: BuybackRentalSummaryComponent;
  let fixture: ComponentFixture<BuybackRentalSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuybackRentalSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuybackRentalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
