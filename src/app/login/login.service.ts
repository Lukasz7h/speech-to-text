import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { backend } from "../backend/data";
import  { object, string } from "zod";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loginForm: FormGroup;
  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder, private router: Router){
    this.loginForm = formBuilder.group({
      login: "",
      password: ""
    });
  }

  // sprawdzamy czy dane użytkownika mają odpowiednią długość
  validForm(): boolean
  {
    const parse = object({
      login: string().min(4).max(22),
      password: string().min(6).max(32)
    })

    return parse.safeParse(this.loginForm.value).success;
  }

  // wysyłany jest formularz logowania użytkownika
  sendForm()
  {
    const form = new FormData();
    if(!this.validForm())
    {
      document.getElementById("errors").textContent = "Login powinien mieć od 4 do 22 znaków, a hasło od 6 do 32."
      return;
    };

    form.append("login", this.loginForm.value['login']);
    form.append("password", this.loginForm.value['password']);

    this.httpClient.post(backend.url+"/login", form, {withCredentials: true})
    .subscribe((x: any) => {
      if(x.error) document.getElementById("errors").textContent = x.error;
      if(x.login) this.router.navigate(['/']);
    });
  }
}