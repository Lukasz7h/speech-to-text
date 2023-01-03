import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { GuardService } from './guard/guard.service';

const route: Routes = [
  {path: "", component: LoginComponent, canActivate: [GuardService]}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ],
  exports: [RouterModule]
})
export class RouteLoginModule { }
