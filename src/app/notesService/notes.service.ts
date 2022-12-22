import { Injectable } from '@angular/core';
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

  createDOCX(a4: HTMLElement, settings)
  {
    const preHtml = 
    `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Export HTML To Doc</title>
    </head>
    <body>`;
    const postHtml = "</body></html>";

    let newDiv: any = document.createElement("div");
    newDiv.textContent = a4.textContent;

    let paragraphContent = '<P STYLE="';

    // dodajemy marginesy do pliku typu docx takie jakie zostały zadeklarowane przez użytkownika
    for(let key in settings.padding)
    {
      paragraphContent += "margin-"+ key.toLowerCase() + ":" + ((settings.padding[`${key}`] * 0.26458) / 10).toFixed(2) + "cm; ";
    };

    paragraphContent += '">'
    const textFromNotes = `<FONT STYLE="font-size: ${settings.fontSize}pt">${a4.textContent}</FONT>`;

    paragraphContent += textFromNotes + "</P>";

    console.log(paragraphContent);
    var html = preHtml+paragraphContent+postHtml;
    
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    let filename = 'document.doc';
    
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);
    downloadLink.href = url;
        
    downloadLink.download = filename;
    downloadLink.click();
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
        const tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0");

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
      case "lines": return this.notesSettingsSubject.next([ { "lines": data.worth.checked } ]);
    };
  }
}