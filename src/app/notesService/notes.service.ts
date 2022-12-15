import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

import { BehaviorSubject } from 'rxjs';
import html2PDF from 'jspdf-html2canvas';

interface IWindow extends Window
{
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  fontsList: string[] = [
    "Roboto-Thin", "Roboto-ThinItalic","Roboto-Black", "Roboto-BlackItalic",
    
    "Roboto-Bold","Roboto-BoldItalic", "Roboto-Italic", "Roboto-Light",

    "Roboto-LightItalic", "Roboto-Medium", "Roboto-MediumItalic", "Roboto-Regular", 
  ];

  notesSettingsSubject: BehaviorSubject<any> = new BehaviorSubject<any>([{fontSize: 20}, {fontList: this.fontsList}, {letterSpacing: 1}, {lineHeight: 25}]);

  constructor()
  {}

  createPDF(a4: HTMLElement): void
  {
    html2PDF(a4,
    {
      filename: 'myfile.pdf',
      image: { type: 'png', quality: 0.28 },
      html2canvas: { scale: 2, dpi: 192 },
      jsPDF: { unit: 'mm', format: "a4", orientation: 'portrait' }
    })
    .save();
  }

  listenUser(notesText: HTMLElement): void
  {
    let flag = false;

    const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    const speechRecognition = new webkitSpeechRecognition();

    window.addEventListener("keydown", (e) => {

      if(e.target['id'] == "notesText" && e.key == "Tab")
      {
        e.preventDefault();

        const doc = e.target['ownerDocument'].defaultView;
        const sel = doc.getSelection();

        const range = sel.getRangeAt(0);
        const tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0");

        range.insertNode(tabNode);
        range.setStartAfter(tabNode);

        range.setEndAfter(tabNode);
        sel.removeAllRanges();
        sel.addRange(range);
      };

      if(flag) return;
      flag = true;

      if(e.keyCode == 75)
      {
        speechRecognition.onresult = (event) => {

          const sentence = event.results[0][0].transcript;
          notesText.textContent += sentence.charAt(0).toUpperCase() + sentence.slice(1)+".";

          const time = setTimeout(() => {
            if(!flag)
            {
              clearTimeout(time);
              return;
            };
            speechRecognition.start();
          }, 200);
        };

        speechRecognition.start();
      };
    })

    window.addEventListener("keyup", (e) => {
      if(e.keyCode == 75) {
        flag = false;
        speechRecognition.stop();
      };
    })
  }

  setStyle(data)
  {
    switch(data.name)
    {
      case "fontFamily": return document.documentElement.style.setProperty("--font-Family", data.worth);
      case "color": return document.documentElement.style.setProperty("--notes-color", data.worth);
    };
  }
}