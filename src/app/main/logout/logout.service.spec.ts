import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { LogoutService } from './logout.service';

describe('LogoutService', () => {
  let service: LogoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(LogoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
