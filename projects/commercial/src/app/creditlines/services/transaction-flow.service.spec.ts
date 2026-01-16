import { TestBed } from '@angular/core/testing';

import { TransactionFlowService } from './transaction-flow.service';

describe('TransactionFlowService', () => {
  let service: TransactionFlowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionFlowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
