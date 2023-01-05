import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GuardService } from './login/guard/guard.service';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {path: "register", loadChildren: () => import("./register/register.module").then(module => module.RegisterModule)},
  {path: "login", loadChildren: () => import("./login/login.module").then(module => module.LoginModule)},
  {path: "documents", loadChildren: () => import("./documents/documents.module").then(module => module.DocumentsModule)},
  {path: "**", component: MainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
