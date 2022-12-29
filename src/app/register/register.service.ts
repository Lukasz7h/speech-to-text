import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { backend } from '../backend/data';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  firstChange: boolean = false;
  currentElement: string;

  registerForm: FormGroup;
  constructor(private httpClient: HttpClient) { }

  addListeners(...elementArr)
  {
    elementArr.forEach((e) => e.nativeElement.addEventListener("click", () => {
      if(!this.firstChange) this.firstChange = true;
      this.currentElement = e.nativeElement.getAttribute("data-attribute");
    }))

    elementArr.forEach((e) => e.nativeElement.addEventListener("focusout", () => {
      if(this.firstChange) this.checkValue();
    }))
  }

  formSubscribe(registerForm)
  {
    registerForm.valueChanges.subscribe((data: any) => {
      if(!this.firstChange) return;
      console.log(this.currentElement);
    })
  }

  validRegisterValue: {checkLen, repeat_password} = {
    checkLen: (word: string, min: number, max: number): boolean => word.length >= min && word.length <= max,
    repeat_password: (pass1: string, pass2: string): boolean => pass1 === pass2,
  }

  checkValue(): boolean
  {
    return this.currentElement == "repeat_password"?
    this.validRegisterValue.repeat_password(this.registerForm.value["password"], this.registerForm.value['repeat_password']):
    (
      this.currentElement == "login"? this.validRegisterValue.checkLen(this.registerForm.value["login"], 4, 22): 
      this.validRegisterValue.checkLen(this.registerForm.value["password"], 6, 32)
    );
  }

  canSend(): boolean
  {
    let result: boolean = true;
    if(this.currentElement) var previousElement = this.currentElement;

    for(let key in this.registerForm.value)
    {
      this.currentElement = key;
      if(!this.checkValue()) result = false;
    };

    previousElement? this.currentElement = previousElement: this.currentElement = undefined;
    return result;
  }

  registerUser()
  {
    const data = new FormData();

    data.append("login", this.registerForm.value['login']);
    data.append("password", this.registerForm.value['password']);

    this.httpClient.post(backend.url+"/register", data)
    .subscribe((data) => {
      console.log(data)
    })
  }
}
