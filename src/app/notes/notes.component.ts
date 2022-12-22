import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';

import { NotesService } from '../notesService/notes.service';
import * as fileSaver from "file-saver";

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
    lines: {notStyleCss: boolean, worth: boolean}
  }

  documentTypes: string[] = ["pdf", "docx"];

  constructor(
    private notesService: NotesService,
    private appService: AppService
  ){
    this.settings = {fontSize: undefined, padding: {Top: 0, Left:0, Bottom: 0, Right: 0}, lines: {notStyleCss: true, worth: true}};
  }

  @ViewChild("a4")
  element: ElementRef;

  bottomPadding(notesText: HTMLElement, paddingBottom: number)
  {
    const a4Height = this.element.nativeElement.offsetHeight;
    let totalHeightOfAllDivs = 0;

    const emptyDives = [];

    Array.from(notesText.getElementsByTagName("div"))
    .forEach((element: HTMLElement) => {
      totalHeightOfAllDivs += element.offsetHeight;
      if(element.textContent.length == 0) emptyDives.push(element);
    });

    const result = a4Height - (totalHeightOfAllDivs + this.settings.padding.Top);

    if(result < paddingBottom)
    {
      for(var i=emptyDives.length-1; i>=0; i--)
      {
          const knit = emptyDives[i].offsetHeight - (paddingBottom - result);
          emptyDives[i].style.height = knit > 0? knit + "px": "0px";
          
          break;
      };

      if(emptyDives[i] && emptyDives[i].offsetHeight == 0) emptyDives[i].remove();
    };
  }

  subscribeSettigs(notesText: HTMLElement): void
  {
    this.appService.settingsSubject.subscribe((data) => {

      const entries = Object.entries(data)[0];
      this.settings.padding[`${entries[0]}`] = entries[1];

      if(entries[0] == "Bottom")
      {
        this.bottomPadding(notesText, entries[1]);
        return;
      };

      notesText.style[`padding${entries[0]}`] = `${entries[1]}px`;
    })
  }

  ngAfterViewInit(): void
  {
    const notesText = document.getElementById("notesText");

    this.subscribeSettigs(notesText);
    this.notesService.listenUser(notesText);

    this.notesService.notesSettingsSubject.subscribe((data: []) => {
      if(!data || data == null) return;

      data.forEach((e) => {
        const entries = Object.entries(e)[0];

        if(this.settings[`${entries[0]}`] && this.settings[`${entries[0]}`].notStyleCss)
        {
          this.settings[`${entries[0]}`].worth = entries[1];
          return;
        }
        
        this.updateView(notesText, entries);
      })
    });
    
  }

  updateView(notesText: HTMLElement, attribute: object): void
  {

    isNaN(Number(attribute[1])) && notesText.style[`${attribute[0]}`]?
    notesText.style[`${attribute[0]}`] = attribute[1]:
    notesText.style[`${attribute[0]}`] = attribute[1] + "px";
  }

  createDocument(notesText: HTMLElement, type: string): void
  {
    switch(type)
    {
      case "pdf": this.notesService.createPDF(notesText);
      break;
      case "docx": this.notesService.createDOCX(notesText, this.settings);
      break;
    }
  }
}
