import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import html2PDF from 'jspdf-html2canvas';

// objekt który używamy do nasłuchiwania mikrofonu użytkownika
interface IWindow extends Window
{
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  a4: HTMLElement;
  settings: {
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
    padding: {
      Left: 0,
      Top: 0,

      Right: 0,
      Bottom: 0
    }
  }

  fontsList: string[] = [
    "Roboto-Thin", "Roboto-ThinItalic","Roboto-Black", "Roboto-BlackItalic",
    
    "Roboto-Bold","Roboto-BoldItalic", "Roboto-Italic", "Roboto-Light",

    "Roboto-LightItalic", "Roboto-Medium", "Roboto-MediumItalic", "Roboto-Regular", 
  ];

  notesSettingsSubject: BehaviorSubject<any> = new BehaviorSubject<any>([{fontSize: 20}, {letterSpacing: 1}, {lineHeight: 25}]);

  constructor()
  {}

  setSettings()
  {
    const settingsFromStorage = JSON.parse(window.localStorage.getItem("settings"));
    const notesTextFromStorage = window.localStorage.getItem("notesText");

    // uaktualnianie listy czcionek która znajduje się w settings component w zależności od tego jaką aktualnie czcionke używa użytkownik
    function currentFont(data: string, value: string): void
    {
      const elementOf = this.fontsList.splice(0, 1, value);

      if(!elementOf[0]) return;
      if(!!this.fontsList.indexOf(elementOf[0])) this.fontsList.push(elementOf[0]);
    }

    function isObjThen(key, obj): void
    {
      for(let e in obj)
      {
        this.settings[`${key}`][`${e}`] = obj[`${e}`];
      };
    }

    if(!settingsFromStorage) return; // jeśli nie posiadamy pobranych ustawiem z local storage kończymy wykonanie funkcji

    const settingsArray = [];
    settingsFromStorage.forEach((e) => {

      const obj = {};
      obj[e[0]] = e[1];

      if(e[0].includes("fontFamily")) currentFont.call(this, e[0], e[1]);

      settingsArray.push(obj);
      e[1] instanceof Object? isObjThen.apply(this, [e[0], e[1]]): this.settings[`${e[0]}`] = e[1];
    });

    this.notesSettingsSubject.next(settingsArray);
    window.onload = () => this.a4.textContent = notesTextFromStorage;
  }

  // pobieranie pliku pdf
  createPDF(): void
  {
    html2PDF(this.a4,
    {
      filename: 'myfile.pdf',
      image: { type: 'jpg', quality: 0.5 },
      html2canvas: { scale: 1.5, dpi: 122 },
      jsPDF: { unit: 'mm', format: "a4", orientation: 'portrait' }
    })
    .save();
  }

  // pobieranie pliku typu docx (word)
  createDOCX()
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
    newDiv.textContent = this.a4.textContent;

    let paragraphContent = '<P STYLE="';

    // dodajemy marginesy do pliku typu docx takie jakie zostały zadeklarowane przez użytkownika
    for(let key in this.settings.padding)
    {
      paragraphContent += "margin-"+ key.toLowerCase() + ":" + ((this.settings.padding[`${key}`] * 0.26458) / 10).toFixed(2) + "cm; ";
    };

    paragraphContent += '">'
    const textFromNotes = `<FONT STYLE="font-size: ${this.settings.fontSize}pt">${this.a4.innerHTML}</FONT>`;

    paragraphContent += textFromNotes + "</P>";
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

      if(e.target['id'] == "notesText" && e.key == "Tab") // jeśli użytkownik nacisnął tab w notatniku
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

      if(e.keyCode == 75) // gdy użytkownik go naciśnie zaczynamy nasłuchiwać to co mówi przez mikrofon i to co mówi dodajemy do notatnika
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
    this.settings[`${data.name}`] = data.worth;
    
    if(data.worth instanceof Object){
      var value = "checked" in data.worth? data.worth['checked']: data.worth;
      this.settings[`${data.name}`] = value;
    };

    switch(data.name)
    {
      case "fontFamily": return this.a4.style.fontFamily = data.worth;
      case "color": return document.documentElement.style.setProperty("--notes-color", data.worth);
      case "lines": return this.notesSettingsSubject.next([ { "lines": data.worth.checked } ]);
    };
  }
}