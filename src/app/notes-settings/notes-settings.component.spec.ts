import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NotesSettingsComponent } from './notes-settings.component';

function moreThen(digit, moreThen): boolean
{
  return !isNaN(digit) && digit > moreThen;
};

describe('NotesSettingsComponent', () => {
  let component: NotesSettingsComponent;
  let fixture: ComponentFixture<NotesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesSettingsComponent ],
      imports: [
        NgxMatColorPickerModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check font', () => {
    expect(moreThen(component.elementFontInput.nativeElement.value, 0)).toBeTrue();

    expect(moreThen(component.elementLetterSpaceInput.nativeElement.value, 0)).toBeTrue();
    expect(moreThen(component.lineHeightInp.nativeElement.value, 0)).toBeTrue();
  });

  it('line showed', () => {
    expect(document.querySelector('input[type="checkbox"]')['checked']).toBeTrue();
  });
});
