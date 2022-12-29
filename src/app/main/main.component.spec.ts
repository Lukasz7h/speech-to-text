import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { HttpClient } from '@angular/common/http';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NotesSettingsComponent } from '../notes-settings/notes-settings.component';
import { NotesToFileComponent } from '../notes-to-file/notes-to-file.component';

import { NotesComponent } from '../notes/notes.component';
import { NotesModule } from '../notes/notes.module';

import { RegisterService } from '../register/register.service';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  let httpClient = jasmine.createSpyObj("HttpClient", ['get']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainComponent, NotesSettingsComponent, NotesComponent, NotesToFileComponent ],
      imports: [
        NgxMatColorPickerModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        MatIconModule,
        NotesModule,
        HttpClientTestingModule
      ],
      providers: [
        RegisterService,
        { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
        { provide: HttpClient, useValue: httpClient }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
