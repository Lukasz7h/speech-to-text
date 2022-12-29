import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';

import { RegisterRouteModule } from './register-route.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RegisterRouteModule,
    HttpClientModule
  ]
})
export class RegisterModule { }
