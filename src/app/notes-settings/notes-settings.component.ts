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
    fontSize: number,
    fontList: string[]
  };

  constructor(
    private notesService: NotesService
  ){
    notesService.notesSettingsSubject.subscribe((data) => {
      console.log(data)
      this.settings = data;
    });
  }

  editNotes(element: any): void
  {
    const newValue = element['value'];
    console.log(element)
    console.log(newValue);
    isNaN(Number(newValue))? this.notesService.setStyle({}): this.notesService.notesSettingsSubject.next({fontSize: Number(newValue)});
  }

  @ViewChild("fontSize")
  elementInput: ElementRef;

  ngAfterViewInit(): void
  {
    this.elementInput.nativeElement.value = this.settings.fontSize;
  }

  onChange(e)
  {
    console.log(e.target.value)
  }
}