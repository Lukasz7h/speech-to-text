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

}