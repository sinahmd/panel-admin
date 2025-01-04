import { TestBed } from '@angular/core/testing';

import { UserRoleCacheService } from './user-role-cache.service';

describe('UserRoleCacheService', () => {
  let service: UserRoleCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRoleCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
