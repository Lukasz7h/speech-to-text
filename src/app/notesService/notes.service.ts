import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import * as html2pdf from "html2pdf-jspdf2";
import { saveAs } from 'file-saver';

import { asBlob } from 'html-docx-js-typescript'

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  public a4: HTMLElement;
  public settings: {
    fontSize: number,

    fontList: string[],
    letterSpacing: number,

    lineHeight: number,
    padding: {
      Top: number,
      Left: number,

      Bottom: number,
      Right: number
    }
  } | any = {
      lines: true,
      fontSize: 20,

      letterSpacing: 1,

      lineHeight: 1,
      padding: {
        Left: 0,
        Top: 0,

        Right: 0,
        Bottom: 0
      }
    }

  public fontsList: string[] = [
    "Roboto-Thin", "Roboto-ThinItalic", "Roboto-Black", "Roboto-BlackItalic",

    "Roboto-Bold", "Roboto-BoldItalic", "Roboto-Italic", "Roboto-Light",

    "Roboto-LightItalic", "Roboto-Medium", "Roboto-MediumItalic", "Roboto-Regular",
  ];

  public notesSettingsSubject: BehaviorSubject<any> = new BehaviorSubject<any>([{ fontSize: 20 }, { letterSpacing: 1 }, { lineHeight: 25 }]);
  public notesTextFromStorage: string;

  setSettings() {
    const settingsFromStorage = JSON.parse(window.localStorage.getItem("settings"));
    this.notesTextFromStorage = window.localStorage.getItem("notesText");

    // uaktualnianie listy czcionek która znajduje się w settings component w zależności od tego jaką aktualnie czcionke używa użytkownik
    function currentFont(data: string, value: string): void {
      const elementOf = this.fontsList.splice(0, 1, value);

      if (!elementOf[0]) return;
      if (!!this.fontsList.indexOf(elementOf[0])) this.fontsList.push(elementOf[0]);
    };

    function isObjThen(key, obj): void {
      for (let e in obj) {
        this.settings[`${key}`][`${e}`] = obj[`${e}`];
      };
    };

    if (!settingsFromStorage) return; // jeśli nie posiadamy pobranych ustawień z local storage kończymy wykonanie funkcji

    const settingsArray = [];
    settingsFromStorage.forEach((e) => {

      const obj = {};
      obj[e[0]] = e[1];

      if (e[0].includes("fontFamily")) currentFont.call(this, e[0], e[1]);

      settingsArray.push(obj);
      e[1] instanceof Object ? isObjThen.apply(this, [e[0], e[1]]) : this.settings[`${e[0]}`] = e[1];
    });


    this.notesSettingsSubject.next(settingsArray);
  }

  // pobieranie pliku pdf
  createPDF(name: string, flag?: boolean): void | any {
    if (window.innerWidth < 1070) {
      const a4_width_pixels = 794; // jest to ilość pixeli równa 210mm (szerokość a4)
      var notes = document.getElementById("notesText");

      const proportions_of_paddings = {
        left: Number( ((Number(notes.style.paddingLeft.replace("px", "")) / notes.clientWidth) * 100).toFixed(0) ) / 100,
        right: Number( ((Number(notes.style.paddingRight.replace("px", "")) / notes.clientWidth) * 100).toFixed(0) ) / 100,

        top: Number( ((Number(notes.style.paddingTop.replace("px", "")) / notes.clientHeight) * 100).toFixed(0) ) / 100,
        bottom: Number( ((Number(notes.style.paddingBottom.replace("px", "")) / notes.clientHeight) * 100).toFixed(0) ) / 100
      };

      var copyPaddings = notes.style.padding;
      var fontSizeNotes = notes.style.fontSize;
      var lineHeightNotes = notes.style.lineHeight;

      notes.style.paddingLeft = (a4_width_pixels * proportions_of_paddings.left).toFixed(0) + "px";
      notes.style.paddingRight = (a4_width_pixels * proportions_of_paddings.right).toFixed(0) + "px";

      notes.style.paddingTop = (a4_width_pixels * proportions_of_paddings.top).toFixed(0) + "px";
      notes.style.paddingBottom = (a4_width_pixels * proportions_of_paddings.bottom).toFixed(0) + "px";

      notes.style.fontSize = (Number(notes.style.fontSize.replace("px", "")) * 3.38).toFixed(0) + "px"
      notes.style.lineHeight = (Number(notes.style.lineHeight.replace("px", "")) * 3.17).toFixed(0) + "px"
    };

    if (!this.a4.style.fontFamily) this.a4.style.fontFamily = this.fontsList[0];

    if (flag)
      return {
        a4: this.a4,
        prop: {
          filename: name + ".pdf",
          image: { type: 'jpg', quality: 1 },
          html2canvas: { scale: 3, dpi: 250 },
          jsPDF: { unit: 'mm', format: "a4", orientation: 'portrait' }
        }
      };

    html2pdf(this.a4,
      {
        filename: name + ".pdf",
        image: { type: 'jpg', quality: 1 },
        html2canvas: { scale: 3, dpi: 250 },
        jsPDF: { unit: 'mm', format: "a4", orientation: 'portrait' }
      })
      .then((data) => {
        if (!notes) return;

        notes.style.padding = copyPaddings;
        notes.style.fontSize = fontSizeNotes;
        notes.style.lineHeight = lineHeightNotes;
      });

  }

  // pobieranie pliku typu docx (word)
  async createDOCX(name: string): Promise<void> {

    const converted: any = await asBlob(document.getElementById("notesText").outerHTML);
    saveAs(converted);
  }


  // ustawiwamy style dla kolory, czcionki lub linijki
  setStyle(data) {
    this.settings[`${data.name}`] = data.worth;

    if (data.worth instanceof Object) {
      var value = "checked" in data.worth ? data.worth['checked'] : data.worth;
      this.settings[`${data.name}`] = value;
    };

    switch (data.name) {
      case "fontFamily": return this.a4.style.fontFamily = data.worth;
      case "color": return this.a4.style.color = data.worth;
      case "lines": return this.notesSettingsSubject.next([{ "lines": data.worth.checked }]);
    };
  }
}