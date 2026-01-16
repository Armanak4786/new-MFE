import { TestBed } from '@angular/core/testing';

import { CommonApiService } from './common-api.service';

describe('CommonService', () => {
  let service: CommonApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
