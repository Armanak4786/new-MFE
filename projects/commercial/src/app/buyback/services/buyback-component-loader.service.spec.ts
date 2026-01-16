import { TestBed } from '@angular/core/testing';

import { BuybackComponentLoaderService } from './buyback-component-loader.service';

describe('BuybackComponentLoaderService', () => {
  let service: BuybackComponentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuybackComponentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
