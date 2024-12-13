import { TestBed } from '@angular/core/testing';

import { AuthenticationGaurdService } from './authentication.gaurd.service';

describe('AuthenticationGaurdService', () => {
  let service: AuthenticationGaurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationGaurdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
