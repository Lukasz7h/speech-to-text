import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';

const routes: Routes = [
  {path: "register", loadChildren: () => import("./register/register.module").then(module => module.RegisterModule)},
  {path: "login", loadChildren: () => import("./login/login.module").then(module => module.LoginModule)},
  {path: "**", component: MainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
