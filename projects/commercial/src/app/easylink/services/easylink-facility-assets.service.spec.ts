import { TestBed } from '@angular/core/testing';

import { EasylinkFacilityAssetsService } from './easylink-facility-assets.service';

describe('EasylinkFacilityAssetsService', () => {
  let service: EasylinkFacilityAssetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EasylinkFacilityAssetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
