import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    
    service = TestBed.inject(RegisterService);
  });

  it('should be created', () => {
    console.log(service)
    expect(service).toBeTruthy();
  });

  it('current element should be not defined', () => {
    expect(service.currentElement).not.toBeDefined()
  })
});
