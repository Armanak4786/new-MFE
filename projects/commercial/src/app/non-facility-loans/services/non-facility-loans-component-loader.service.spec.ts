import { TestBed } from '@angular/core/testing';

import { NonFacilityLoansComponentLoaderService } from './non-facility-loans-component-loader.service';

describe('NonFacilityLoansComponentLoaderService', () => {
  let service: NonFacilityLoansComponentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonFacilityLoansComponentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
