import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LineComponent } from './line/line.component';
import { NotesComponent } from './notes.component';

@NgModule({
  declarations: [
    NotesComponent,
    LineComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NotesComponent
  ]
})
export class NotesModule { }
