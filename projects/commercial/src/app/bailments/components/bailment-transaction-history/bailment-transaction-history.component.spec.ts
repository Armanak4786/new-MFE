import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BailmentTransactionHistoryComponent } from './bailment-transaction-history.component';

describe('BailmentTransactionHistoryComponent', () => {
  let component: BailmentTransactionHistoryComponent;
  let fixture: ComponentFixture<BailmentTransactionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BailmentTransactionHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BailmentTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
