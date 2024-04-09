import { TestBed } from '@angular/core/testing';

import { EthAuthService } from './eth-auth.service';

describe('EthAuthService', () => {
  let service: EthAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EthAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
