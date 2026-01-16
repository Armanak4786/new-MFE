import { TestBed } from '@angular/core/testing';

import { FloatingFloorPlanSetterGetterService } from './floating-floor-plan-setter-getter.service';

describe('FloatingFloorPlanSetterGetterService', () => {
  let service: FloatingFloorPlanSetterGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FloatingFloorPlanSetterGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
