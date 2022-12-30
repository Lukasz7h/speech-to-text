import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent
{

  constructor(public loginService: LoginService, private formBuilder: FormBuilder)
  {
    loginService.loginForm = formBuilder.group({
      login: "",
      password: ""
    });
  }

  send()
  {
    this.loginService.sendForm();
  }


}