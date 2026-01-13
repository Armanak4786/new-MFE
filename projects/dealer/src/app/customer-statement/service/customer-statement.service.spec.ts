import { TestBed } from '@angular/core/testing';

import { CustomerStatementService } from './customer-statement.service';

describe('CustomerStatementService', () => {
  let service: CustomerStatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerStatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
