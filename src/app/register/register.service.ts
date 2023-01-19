import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { backend } from '../backend/data';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  private firstChange: boolean = false;
  private currentElement: string;

  public subscriber: Subscription;

  public registerForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) {
    this.registerForm = formBuilder.group({
      login: "",
      password: "",

      repeat_password: ""
    })
  }

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

  formSubscribe()
  {
    this.subscriber = this.registerForm.valueChanges.subscribe((data: any) => {
      if(!this.firstChange) return;
    });
  }

  checkValue(): boolean
  {
    const validRegisterValue: {checkLen, repeat_password} = {
      checkLen: (word: string, min: number, max: number): boolean => word.length >= min && word.length <= max,
      repeat_password: (pass1: string, pass2: string): boolean => pass1 === pass2,
    };

    return this.currentElement == "repeat_password"?
    validRegisterValue.repeat_password(this.registerForm.value["password"], this.registerForm.value['repeat_password']):
    (
      this.currentElement == "login"? validRegisterValue.checkLen(this.registerForm.value["login"], 4, 22): 
      validRegisterValue.checkLen(this.registerForm.value["password"], 6, 32)
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

  registerUser(): Promise<any>
  {
    return new Promise((resolve) => {
      const data = new FormData();

      data.append("login", this.registerForm.value['login']);
      data.append("password", this.registerForm.value['password']);
  
      this.httpClient.post(backend.url+"/register", data)
      .subscribe((data) => {
        resolve(data);
      })
    })
    
  }
}
