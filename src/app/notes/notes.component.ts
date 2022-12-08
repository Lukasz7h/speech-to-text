import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
      console.log(emptyDives)
      for(let i=emptyDives.length-1; i>=0; i--)
      {
        if(emptyDives[i].offsetHeight > 0)
        {
          emptyDives[i].style.height = emptyDives[i].offsetHeight - (paddingBottom - result) + "px";
          break;
        }
        else
        {

        }
      };
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
    this.notesService.notesSettingsSubject.subscribe((data) => {
      if(!data || data == null) return;
      
      const entries = Object.entries(data)[0];
      this.settings[`${entries[0]}`] = entries[1];
      this.updateView(notesText, entries);
    });
  }

  updateView(notesText: HTMLElement, attribute: object): void
  {
    isNaN(Number(attribute[1]))?
    notesText.style[`${attribute[0]}`] = attribute[1]:
    notesText.style[`${attribute[0]}`] = attribute[1] + "px";
  }

  createDocument(notesText: HTMLElement): void
  {
    this.notesService.createPDF(notesText, this.settings);
  }
}
