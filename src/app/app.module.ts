import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NotesSettingsComponent } from './notes-settings/notes-settings.component';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { NotesModule } from './notes/notes.module';
import { NotesToFileComponent } from './notes-to-file/notes-to-file.component';

import { MatIconModule } from '@angular/material/icon';
import { MainComponent } from './main/main.component';

import { RegisterModule } from './register/register.module';

@NgModule({
  declarations: [
    AppComponent,
    NotesSettingsComponent,
    NotesToFileComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxMatColorPickerModule,
    MatFormFieldModule,
    MatInputModule,
    NoopAnimationsModule,
    FormsModule,
    NotesModule,
    MatIconModule,
    RegisterModule
  ],
  providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
  bootstrap: [AppComponent]
})
export class AppModule { }
