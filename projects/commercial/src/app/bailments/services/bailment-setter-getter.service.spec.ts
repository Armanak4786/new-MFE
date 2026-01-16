import { TestBed } from '@angular/core/testing';

import { BailmentSetterGetterService } from './bailment-setter-getter.service';

describe('BailmentSetterGetterService', () => {
  let service: BailmentSetterGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BailmentSetterGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
