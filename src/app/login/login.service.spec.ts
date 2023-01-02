import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FormBuilder]
    });

    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should had defined login form as "FormGroup" type', () => {
    expect(service.loginForm as FormGroup).toBeTruthy();
  });

  it('login valid should return true', () => {
    service.loginForm.value['login'] = '1234';
    service.loginForm.value['password'] = '123456';

    expect(service.validForm()).toBeTrue();
  });
});
