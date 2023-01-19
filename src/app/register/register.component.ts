import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
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

  async sendForm()
  {
    if(!this.registerService.canSend()) return;
    await this.registerService.registerUser();
  }
}