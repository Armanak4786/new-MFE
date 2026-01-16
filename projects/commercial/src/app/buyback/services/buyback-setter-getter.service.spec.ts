import { TestBed } from '@angular/core/testing';

import { BuybackSetterGetterService } from './buyback-setter-getter.service';

describe('BuybackSetterGetterService', () => {
  let service: BuybackSetterGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuybackSetterGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
