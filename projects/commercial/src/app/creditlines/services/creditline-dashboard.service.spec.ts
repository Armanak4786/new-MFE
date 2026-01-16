import { TestBed } from '@angular/core/testing';

import { CreditlineDashboardService } from './creditline-dashboard.service';

describe('CreditlineDashboardService', () => {
  let service: CreditlineDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditlineDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
