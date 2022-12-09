import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

import { BehaviorSubject } from 'rxjs';
import html2PDF from 'jspdf-html2canvas';
import { font } from '../roboto/robotoThin';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notesSettingsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({fontSize: 20});

  constructor() {}

  createPDF(a4: HTMLElement, settings: any): void
  {
    const pdf = new jsPDF("p", "mm", [297, 210]);

    /*pdf.addFileToVFS("Roboto-Thin.ttf", font);
    pdf.addFont("Roboto-Thin.ttf", "Roboto-Thin", "normal");
    pdf.setFont("Roboto-Thin");

    const maxWidth = (210 - settings.padding.Left / 3.779528 - settings.padding.Right / 3.779528);

    pdf.setFontSize(settings.fontSize - 4.9);
    pdf.text(a4.innerText, settings.padding.Left / 3.779528, settings.padding.Top / 3.779528 + 4.8, {maxWidth: maxWidth});*/

    html2PDF(a4,{
      filename: 'myfile.pdf',
      image: { type: 'png', quality: 0.28 },
      html2canvas: { scale: 2, dpi: 192 },
      jsPDF: { unit: 'mm', format: "a4", orientation: 'portrait' }
    }).save();
  }

  listenUser(notesText: HTMLElement): void
  {
    let flag = false;

    const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    const speechRecognition = new webkitSpeechRecognition();

    window.addEventListener("keydown", (e) => {

      if(flag) return;
      flag = true;

      if(e.keyCode == 75)
      {
        speechRecognition.onresult = (event) => {

          console.log(event.results[0][0])
          notesText.textContent += event.results[0][0].transcript;

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

}