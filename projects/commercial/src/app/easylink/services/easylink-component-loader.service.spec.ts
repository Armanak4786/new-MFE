import { TestBed } from '@angular/core/testing';

import { EasylinkComponentLoaderService } from './easylink-component-loader.service';

describe('EasylinkComponentLoaderService', () => {
  let service: EasylinkComponentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EasylinkComponentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
