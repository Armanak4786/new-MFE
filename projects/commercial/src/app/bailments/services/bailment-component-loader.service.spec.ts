import { TestBed } from '@angular/core/testing';

import { BailmentComponentLoaderService } from './bailment-component-loader.service';

describe('BailmentComponentLoaderService', () => {
  let service: BailmentComponentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BailmentComponentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
