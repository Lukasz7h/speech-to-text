import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { FormBuilder, FormGroup } from '@angular/forms';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FormBuilder]
    });
    
    service = TestBed.inject(RegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('current element should be not defined', () => {
    expect(service.currentElement).not.toBeDefined()
  });

  it('should had defined register form as "FormGroup" type', () => {
    expect(service.registerForm as FormGroup).toBeTruthy();
  });

  it('valid of form should return true', () => {
    service.registerForm.value['login'] = "1234";
    service.registerForm.value['password'] = "123456";
    service.registerForm.value['repeat_password'] = "123456";

    expect(service.canSend()).toBeTrue();
  });

  it('method register should return proper worth', async() => {
    service.registerForm.value['login'] = 'test123';
    service.registerForm.value['password'] = 'test123456';
    
    let result = await service.registerUser();
    result = result['register'] || result['error'];

    expect(result).toBeTruthy();
  });
});
