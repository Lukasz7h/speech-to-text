import { AfterViewInit, Component } from '@angular/core';
import { NotesService } from '../notesService/notes.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements AfterViewInit
{
  settings: {
    fontSize: number
  }

  constructor(
    private notesService: NotesService
  ){}

  ngAfterViewInit(): void
  {
    const a4 = document.getElementById("a4");

    this.notesService.notesSettingsSubject.subscribe((data) => {
      if(!data || data == null) return;
      
      this.settings = data;
      this.updateView(a4, Object.entries(data)[0]);
    });
  }

  updateView(a4: HTMLElement, attribute: object): void
  {
    isNaN(Number(attribute[1]))?
    a4.style[`${attribute[0]}`] = attribute[1]:
    a4.style[`${attribute[0]}`] = attribute[1] + "px";
  }
}
