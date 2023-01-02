import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { NotesToFileComponent } from './notes-to-file.component';

describe('NotesToFileComponent', () => {
  let component: NotesToFileComponent;
  let fixture: ComponentFixture<NotesToFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesToFileComponent ],
      imports: [MatIconModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesToFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('documentTypes should be array of string', () => {
    expect(component.documentTypes instanceof Array).toBeTrue();
  });

  it('documentType array should had only string', () => {
    expect(component.documentTypes.every((e) => typeof e == "string")).toBeTrue();
  });
});
