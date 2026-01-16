import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFlowComponent } from './transaction-flow.component';

describe('TransactionFlowComponent', () => {
  let component: TransactionFlowComponent;
  let fixture: ComponentFixture<TransactionFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
