
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit, OnDestroy
{

  constructor(public registerService: RegisterService, private router: Router){
    this.registerService.formSubscribe();
  }

  @ViewChild("inpLogin")
  private inpLogin: ElementRef;

  @ViewChild("inpPassword")
  private inpPassword: ElementRef;

  @ViewChild("inpRepeatPassword")
  private inpRepeatPassword: ElementRef;

  ngAfterViewInit(): void
  {
    this.registerService.addListeners(this.inpLogin, this.inpPassword, this.inpRepeatPassword);
  }

  ngOnDestroy(): void {
    this.registerService.subscriber.unsubscribe();
  }

  // wysyłanie formularza
  async sendForm()
  {
    const canSend = this.registerService.canSend();
    if(!canSend){
      document.getElementById("errors").innerHTML = "Login powinien miec od 4 do 22 znaków. <br> Hasło powinno mieć od 6 do 32 znaków";
      return;
    };

    const result = await this.registerService.registerUser();
    if(result.error) document.getElementById("errors").innerHTML = result.error;
    else{
      alert("Utworzono konto!");
      this.router.navigate([""]);
    }
  }
}