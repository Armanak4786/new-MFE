import { TestBed } from '@angular/core/testing';

import { AssetlinkSetterGetterService } from './assetlink-setter-getter.service';

describe('AssetlinkSetterGetterService', () => {
  let service: AssetlinkSetterGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetlinkSetterGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
