import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WebSiteGuard } from './guards/site/site.service';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {path: "register", canActivate: [WebSiteGuard], loadChildren: () => import("./register/register.module").then(module => module.RegisterModule)},
  {path: "login", canActivate: [WebSiteGuard], loadChildren: () => import("./login/login.module").then(module => module.LoginModule)},
  {path: "documents", canActivate: [WebSiteGuard], loadChildren: () => import("./documents/documents.module").then(module => module.DocumentsModule)},
  {path: "**", component: MainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
