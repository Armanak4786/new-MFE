import { TestBed } from '@angular/core/testing';

import { CreditlineSetterGetterService } from './creditline-setter-getter.service';

describe('CreditlineSetterGetterService', () => {
  let service: CreditlineSetterGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditlineSetterGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
