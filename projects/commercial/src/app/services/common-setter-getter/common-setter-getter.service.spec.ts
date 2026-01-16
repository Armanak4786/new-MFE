import { TestBed } from '@angular/core/testing';

import { CommonSetterGetterService } from './common-setter-getter.service';

describe('CommonSetterGetterService', () => {
  let service: CommonSetterGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonSetterGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
