import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { NotesService } from '../notesService/notes.service';

@Component({
  selector: 'app-notes-settings',
  templateUrl: './notes-settings.component.html',
  styleUrls: ['./notes-settings.component.css']
})
export class NotesSettingsComponent implements AfterViewInit
{
  private button;

  private user = { color: '#234532' };
  protected disabled = false;

  protected color: ThemePalette = 'primary';
  protected touchUi = false;

  constructor(
    public notesService: NotesService,
    private changeDetRef: ChangeDetectorRef
  ){
  }

  // przekazujemy style do zmodyfikowania w notesie
  editNotes(data: {element: any, change: any}): void
  {
    const newValue = data.change['value'];
    const attribute = data.element.getAttribute("data-attribute");

    isNaN(Number(newValue))?
    this.notesService.setStyle({name: attribute, worth: newValue}):
    this.notesService.notesSettingsSubject.next([{[`${attribute}`]: Number(newValue)}]);
  }

  @ViewChild("fontInp")
  private elementFontInput: ElementRef;

  @ViewChild("letterInp")
  private elementLetterSpaceInput: ElementRef;

  @ViewChild("colorElement")
  private colorElement: ElementRef;

  @ViewChild("lineInp")
  private lineHeightInp: ElementRef;

  ngAfterViewInit(): void
  {
    this.elementFontInput.nativeElement.value = this.notesService.settings.fontSize;
    this.elementLetterSpaceInput.nativeElement.value = this.notesService.settings.letterSpacing;

    this.lineHeightInp.nativeElement.value = this.notesService.settings.lineHeight;

    this.button = this.colorElement.nativeElement.getElementsByTagName("button").item(0);
    let count = 0;

    this.button.addEventListener("click", (e) => {

      if(document.getElementsByClassName("cdk-overlay-container").item(0) && count)
      {
        document.getElementsByClassName("cdk-overlay-container").item(0).classList.toggle("hide");
        return;
      };

      count++;
    })
  }
}