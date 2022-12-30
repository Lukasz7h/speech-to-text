import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { backend } from "../backend/data";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginForm: FormGroup;
  constructor(private httpClient: HttpClient){}

  sendForm()
  {
    const form = new FormData();

    form.append("login", this.loginForm.value['login']);
    form.append("password", this.loginForm.value['password']);

    console.log(this.loginForm.value['login'])

    this.httpClient.post(backend.url+"/login", form, {withCredentials: true})
    .subscribe((data) => {
      console.log(data)
    });
  }
}