import { TestBed } from '@angular/core/testing';

import { FloatingFloorPlanComponentLoaderService } from './floating-floor-plan-component-loader.service';

describe('FloatingFloorPlanComponentLoaderService', () => {
  let service: FloatingFloorPlanComponentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FloatingFloorPlanComponentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
