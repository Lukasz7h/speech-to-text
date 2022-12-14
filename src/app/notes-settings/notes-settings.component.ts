import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
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
    fontList: string[],
    letterSpacing: number,
    colors: string[]
  } = {fontSize: undefined, fontList: undefined, letterSpacing: undefined, colors: undefined};

  button;

  user = { color: '#234532' };
  disabled = false;

  color: ThemePalette = 'primary';
  touchUi = false;

  constructor(
    private notesService: NotesService
  ){
    notesService.notesSettingsSubject.subscribe((data: []) => {
      data.forEach((e) => {
        const key = Object.keys(e)[0];
        this.settings[`${key}`] = e[`${key}`];
      });
    });
  }

  editNotes(data: {element: HTMLElement, change: any}): void
  {
    const newValue = data.change['value'];
    const attribute = data.element.getAttribute("data-attribute");

    isNaN(Number(newValue))? this.notesService.setStyle({name: attribute, worth: newValue}): this.notesService.notesSettingsSubject.next([{[`${attribute}`]: Number(newValue)}]);
  }

  @ViewChild("fontInp")
  elementFontInput: ElementRef;

  @ViewChild("letterInp")
  elementLetterSpaceInput: ElementRef;

  @ViewChild("colorElement")
  colorElement: ElementRef;

  ngAfterViewInit(): void
  {
    this.elementFontInput.nativeElement.value = this.settings.fontSize;
    this.elementLetterSpaceInput.nativeElement.value = this.settings.letterSpacing;

    this.button = this.colorElement.nativeElement.getElementsByTagName("button").item(0);
    let count = 0;

    this.button.addEventListener("click", (e) => {
      if(document.getElementsByClassName("cdk-overlay-container").item(0) && count) document.getElementsByClassName("cdk-overlay-container").item(0).classList.toggle("hide");
      count++;
    })
  }
}