import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { backend } from "../backend/data";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginForm: FormGroup;
  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder, private router: Router){
    this.loginForm = formBuilder.group({
      login: "",
      password: ""
    });
  }

  validForm(): boolean
  {
    return this.loginForm.value['login'].length >= 4 && this.loginForm.value['login'].length <= 22 &&
    this.loginForm.value['password'].length >= 6 && this.loginForm.value['password'].length <= 32
  }

  sendForm()
  {
    const form = new FormData();
    if(!this.validForm()) return;

    form.append("login", this.loginForm.value['login']);
    form.append("password", this.loginForm.value['password']);

    this.httpClient.post(backend.url+"/login", form, {withCredentials: true})
    .subscribe((x: any) => {
      if(x.login) this.router.navigate(['/']);
    });
  }
}