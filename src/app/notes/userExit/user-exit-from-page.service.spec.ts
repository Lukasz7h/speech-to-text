import { TestBed } from '@angular/core/testing';

import { UserExitFromPageService } from './user-exit-from-page.service';

describe('UserExitFromPageService', () => {
  let service: UserExitFromPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExitFromPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
