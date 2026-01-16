import { TestBed } from '@angular/core/testing';

import { BaseEasylinkService } from './base-easylink.service';

describe('BaseEasylinkService', () => {
  let service: BaseEasylinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseEasylinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
