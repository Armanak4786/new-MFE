import { TestBed } from '@angular/core/testing';

import { EasylinkSetterGetterService } from './easylink-setter-getter.service';

describe('EasylinkSetterGetterService', () => {
  let service: EasylinkSetterGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EasylinkSetterGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
