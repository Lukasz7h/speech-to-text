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
      Top: number,
      Left: number,

      Bottom: number,
      Right: number
    }
  }

  constructor(
    private notesService: NotesService,
    private appService: AppService
  ){
    this.settings = {fontSize: undefined, padding: {Top: 0, Left:0, Bottom: 0, Right: 0}};
  }

  bottomPadding(a4: HTMLElement)
  {
    console.log(a4.offsetHeight - this.settings.padding.Top)
  }

  subscribeSettigs(a4: HTMLElement): void
  {
    this.appService.settingsSubject.subscribe((data) => {
      const entries = Object.entries(data)[0];

      this.settings.padding[`${entries[0]}`] = entries[1];
      a4.style[`padding${entries[0]}`] = `${entries[1]}px`;
    })
  }

  ngAfterViewInit(): void
  {
    const a4 = document.getElementById("notesText");

    this.subscribeSettigs(a4);
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

  createDocument(a4: HTMLElement): void
  {
    this.notesService.createPDF(a4, this.settings);
  }
}
