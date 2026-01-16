import { TestBed } from '@angular/core/testing';

import { OlSetterGetterService } from './ol-setter-getter.service';

describe('OlSetterGetterService', () => {
  let service: OlSetterGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OlSetterGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
