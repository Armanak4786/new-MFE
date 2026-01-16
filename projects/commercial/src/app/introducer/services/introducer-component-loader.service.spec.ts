import { TestBed } from '@angular/core/testing';

import { IntroducerComponentLoaderService } from './introducer-component-loader.service';

describe('IntroducerComponentLoaderService', () => {
  let service: IntroducerComponentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntroducerComponentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
