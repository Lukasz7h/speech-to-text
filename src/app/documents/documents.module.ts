import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsComponent } from './documents.component';
import { RouterModule, Routes } from '@angular/router';

import { GuardService } from '../login/guard/guard.service';

const routes: Routes = [
  {path: "**", component: DocumentsComponent, canActivate: [GuardService]}
];

@NgModule({
  declarations: [
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DocumentsModule { }
