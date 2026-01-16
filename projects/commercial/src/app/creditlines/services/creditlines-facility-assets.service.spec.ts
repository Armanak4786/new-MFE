import { TestBed } from '@angular/core/testing';

import { CreditlinesFacilityAssetsService } from './creditlines-facility-assets.service';

describe('CreditlinesFacilityAssetsService', () => {
  let service: CreditlinesFacilityAssetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditlinesFacilityAssetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
