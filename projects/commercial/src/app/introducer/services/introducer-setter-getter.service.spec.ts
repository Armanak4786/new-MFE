import { TestBed } from '@angular/core/testing';

import { IntroducerSetterGetterService } from './introducer-setter-getter.service';

describe('IntroducerSetterGetterService', () => {
  let service: IntroducerSetterGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntroducerSetterGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
