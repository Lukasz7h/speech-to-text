import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit, OnDestroy
{

  constructor(public registerService: RegisterService){
    this.registerService.formSubscribe();
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

  ngOnDestroy(): void {
    this.registerService.subscriber.unsubscribe();
  }

  async sendForm()
  {
    if(!this.registerService.canSend()) return;
    await this.registerService.registerUser();
  }
}