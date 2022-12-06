import { AfterViewInit, Component } from '@angular/core';
import { AppService } from '../app.service';
import { NotesService } from '../notesService/notes.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements AfterViewInit
{
  settings: {
    fontSize: number,
    padding: {
      top: number,
      left: number,

      bottom: number,
      right: number
    }
  }

  constructor(
    private notesService: NotesService,
    private appService: AppService
  ){
    this.settings = {fontSize: undefined, padding: {top: 0, left:0, bottom: 0, right: 0}};

    appService.settingsSubject.subscribe((data) => {
      const entries = Object.entries(data)[0];
      this.settings.padding[`${entries[0]}`] = entries[1];
    })
  }

  ngAfterViewInit(): void
  {
    const a4 = document.getElementById("a4");

    this.notesService.notesSettingsSubject.subscribe((data) => {
      if(!data || data == null) return;
      
      const entries = Object.entries(data)[0];
      this.settings[`${entries[0]}`] = entries[1];
      this.updateView(a4, entries);
    });
  }

  updateView(a4: HTMLElement, attribute: object): void
  {
    isNaN(Number(attribute[1]))?
    a4.style[`${attribute[0]}`] = attribute[1]:
    a4.style[`${attribute[0]}`] = attribute[1] + "px";
  }

  createDocument(a4: HTMLElement)
  {
    this.notesService.createPDF(a4, this.settings);
  }
}
