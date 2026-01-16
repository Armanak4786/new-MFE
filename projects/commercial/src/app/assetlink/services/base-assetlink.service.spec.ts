import { TestBed } from '@angular/core/testing';

import { BaseAssetlinkService } from './base-assetlink.service';

describe('BaseAssetlinkService', () => {
  let service: BaseAssetlinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseAssetlinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
