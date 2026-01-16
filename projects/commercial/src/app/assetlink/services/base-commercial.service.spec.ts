import { TestBed } from '@angular/core/testing';

import { BaseCommercialService } from './base-commercial.service';

describe('BaseCommercialService', () => {
  let service: BaseCommercialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseCommercialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
