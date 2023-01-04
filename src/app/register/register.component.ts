import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit
{

  constructor(public registerService: RegisterService){

    this.registerService.formSubscribe(this.registerService.registerForm);
  }

  @ViewChild("inpLogin")
  inpLogin: ElementRef;

  @ViewChild("inpPassword")
  inpPassword: ElementRef;

  @ViewChild("inpRepeatPassword")
  inpRepeatPassword: ElementRef;

  ngAfterViewInit(): void
  {
    this.registerService.addListeners(this.inpLogin, this.inpPassword, this.inpRepeatPassword);
  }

  async sendForm()
  {
    if(!this.registerService.canSend()) return;
    const result = await this.registerService.registerUser();

    
  }
}