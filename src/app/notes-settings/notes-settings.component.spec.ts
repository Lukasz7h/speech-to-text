import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesSettingsComponent } from './notes-settings.component';

describe('NotesSettingsComponent', () => {
  let component: NotesSettingsComponent;
  let fixture: ComponentFixture<NotesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
