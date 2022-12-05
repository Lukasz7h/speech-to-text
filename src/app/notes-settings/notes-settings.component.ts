import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NotesService } from '../notesService/notes.service';

@Component({
  selector: 'app-notes-settings',
  templateUrl: './notes-settings.component.html',
  styleUrls: ['./notes-settings.component.css']
})
export class NotesSettingsComponent implements AfterViewInit
{

  settings: {
    fontSize: number
  };

  constructor(
    private notesService: NotesService
  ){
    notesService.notesSettingsSubject.subscribe((data) => {
      this.settings = data;
    });
  }

  editNotes(element: HTMLElement): void
  {
    const newValue = element['value'];
    isNaN(Number(newValue))? "": this.notesService.notesSettingsSubject.next({fontSize: Number(newValue)});
  }

  @ViewChild("fontSize")
  elementInput: ElementRef;

  ngAfterViewInit(): void
  {
    this.elementInput.nativeElement.value = this.settings.fontSize;
  }

}