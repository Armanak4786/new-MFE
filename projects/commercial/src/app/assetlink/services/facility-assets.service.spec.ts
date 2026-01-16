import { TestBed } from '@angular/core/testing';

import { FacilityAssetsService } from './facility-assets.service';

describe('FacilityAssetsService', () => {
  let service: FacilityAssetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacilityAssetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
