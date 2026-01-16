import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionPayDetailsComponent } from './transaction-pay-details.component';

describe('TransactionPayDetailsComponent', () => {
  let component: TransactionPayDetailsComponent;
  let fixture: ComponentFixture<TransactionPayDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionPayDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionPayDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
