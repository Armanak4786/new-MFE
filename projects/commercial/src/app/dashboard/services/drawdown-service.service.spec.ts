import { TestBed } from '@angular/core/testing';

import { DrawdownServiceService } from './drawdown-service.service';

describe('DrawdownServiceService', () => {
  let service: DrawdownServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawdownServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
