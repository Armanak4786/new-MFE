import { TestBed } from '@angular/core/testing';

import { CreditlinesComponentLoaderService } from './creditlines-component-loader.service';

describe('CreditlinesComponentLoaderService', () => {
  let service: CreditlinesComponentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditlinesComponentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
