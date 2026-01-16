import { TestBed } from '@angular/core/testing';

import { OperatingLeaseComponentLoaderService } from './operating-lease-component-loader.service';

describe('OperatingLeaseComponentLoaderService', () => {
  let service: OperatingLeaseComponentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperatingLeaseComponentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
