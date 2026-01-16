import { TestBed } from '@angular/core/testing';

import { NonFaciltyApiService } from './non-facilty-api.service';

describe('NonFaciltyApiService', () => {
  let service: NonFaciltyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonFaciltyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
