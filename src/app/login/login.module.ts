import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login.component';

import { RouteLoginModule } from './route-login.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouteLoginModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
