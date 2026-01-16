import { TestBed } from '@angular/core/testing';

import { NonFacilityGetterSetterService } from './non-facility-getter-setter.service';

describe('NonFacilityGetterSetterService', () => {
  let service: NonFacilityGetterSetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonFacilityGetterSetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
