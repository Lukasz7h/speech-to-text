import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { GuardService } from './guard.service';

describe('GuardService', () => {
  let service: GuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(GuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return boolean data', async () => {
    expect(await service.canActivate()).toBeInstanceOf(Boolean)
  })
});
