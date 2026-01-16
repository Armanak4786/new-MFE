import { TestBed } from '@angular/core/testing';

import { FixedFloorPlanComponentLoaderServiceTsService } from './fixed-floor-plan-component-loader.service';

describe('FixedFloorPlanComponentLoaderServiceTsService', () => {
  let service: FixedFloorPlanComponentLoaderServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixedFloorPlanComponentLoaderServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
