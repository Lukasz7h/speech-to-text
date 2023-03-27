import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import * as html2pdf from "html2pdf-jspdf2";
import { HttpClient } from '@angular/common/http';

// objekt który używamy do nasłuchiwania mikrofonu użytkownika
export interface IWindow extends Window
{
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
};

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
    "Roboto-Thin", "Roboto-ThinItalic","Roboto-Black", "Roboto-BlackItalic",
    
    "Roboto-Bold","Roboto-BoldItalic", "Roboto-Italic", "Roboto-Light",

    "Roboto-LightItalic", "Roboto-Medium", "Roboto-MediumItalic", "Roboto-Regular", 
  ];

  public notesSettingsSubject: BehaviorSubject<any> = new BehaviorSubject<any>([{fontSize: 20}, {letterSpacing: 1}, {lineHeight: 25}]);
  public notesTextFromStorage: string;

  constructor(private httpClient: HttpClient)
  {}

  setSettings()
  {
    const settingsFromStorage = JSON.parse(window.localStorage.getItem("settings"));
    this.notesTextFromStorage = window.localStorage.getItem("notesText");

    alert(JSON.stringify(settingsFromStorage));

    // uaktualnianie listy czcionek która znajduje się w settings component w zależności od tego jaką aktualnie czcionke używa użytkownik
    function currentFont(data: string, value: string): void
    {
      const elementOf = this.fontsList.splice(0, 1, value);

      if(!elementOf[0]) return;
      if(!!this.fontsList.indexOf(elementOf[0])) this.fontsList.push(elementOf[0]);
    };

    function isObjThen(key, obj): void
    {
      for(let e in obj)
      {
        this.settings[`${key}`][`${e}`] = obj[`${e}`];
      };
    };

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
  }

  // pobieranie pliku pdf
  createPDF(name: string): void
  {
    if(window.innerWidth < 1070)
    {
      const a4_width_pixels = 794; // jest to ilość pixeli równa 210mm (szerokość a4)
      var notes = document.getElementById("notesText");

      const proportions_of_paddings = {
        left: Number( (( Number(notes.style.paddingLeft.replace("px", "")) / notes.clientWidth) * 100).toFixed(0)) / 100,
        right: Number( ((Number(notes.style.paddingRight.replace("px", "")) / notes.clientWidth) * 100).toFixed(0)) / 100,

        top: Number( ((Number(notes.style.paddingTop.replace("px", "")) / notes.clientHeight) * 100).toFixed(0)) / 100,
        bottom: Number( ((Number(notes.style.paddingBottom.replace("px", "")) / notes.clientHeight) * 100).toFixed(0)) / 100
      };

      var copyPaddings = notes.style.padding;
      var fontSizeNotes = notes.style.fontSize;
      var lineHeightNotes = notes.style.lineHeight;

      notes.style.paddingLeft =  (a4_width_pixels * proportions_of_paddings.left).toFixed(0)+"px";
      notes.style.paddingRight =  (a4_width_pixels * proportions_of_paddings.right).toFixed(0)+"px";

      notes.style.paddingTop =  (a4_width_pixels * proportions_of_paddings.top).toFixed(0)+"px";
      notes.style.paddingBottom =  (a4_width_pixels * proportions_of_paddings.bottom).toFixed(0)+"px";

      notes.style.fontSize = (Number(notes.style.fontSize.replace("px", "")) * 3.38).toFixed(0) + "px"
      notes.style.lineHeight = (Number(notes.style.lineHeight.replace("px", "")) * 3.17).toFixed(0) + "px"
    };

    if(!this.a4.style.fontFamily) this.a4.style.fontFamily = this.fontsList[0];

    html2pdf(this.a4,
    {
      filename: name+".pdf",
      image: { type: 'jpg', quality: 0.5 },
      html2canvas: { scale: 1.5, dpi: 122 },
      jsPDF: { unit: 'mm', format: "a4", orientation: 'portrait' }
    })
    .then((data) => {
      if(!notes) return;
    
      notes.style.padding = copyPaddings;
      notes.style.fontSize = fontSizeNotes;
      notes.style.lineHeight = lineHeightNotes;
    });

  }

  // pobieranie pliku typu docx (word)
  createDOCX(name: string): void
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
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);
    downloadLink.href = url;
        
    downloadLink.download = name+".doc";
    downloadLink.click();
  }

  previousSentence = [];

  write(notesText)
  {
    const whenComma = [
      'a', 'ale', 'aliści', 'inaczej', 'jednak',
      'jednakże', 'jedynie', 'lecz', 'natomiast',
      'przecież', 'raczej', 'tylko', 'tylko że',
      'tymczasem', 'wszakże', 'zaś', 'za to',
      'więc', 'dlatego', 'toteż', 'to', 'zatem', 
      'stąd', 'wobec tego', 'skutkiem tego',
      'wskutek tego', 'przeto', 'tedy', 'chyba',
      'ewentualnie', 'na przykład', 'nawet',
      'prawdopodobnie', 'przynajmniej', 'raczej',
      'taki jak', 'ach', 'halo', 'hej', 'ho',
      'o', 'oj', 'bez wątpienia', 'bynajmniej',
      'doprawdy, istotnie', 'na odwrót', 'naturalnie',
      'niestety', 'niewątpliwie', 'niezawodnie',
      'oczywiście', 'odwrotnie', 'owszem', 'przeciwnie',
      'rzecz jasna', 'rzeczywiście', 'zapewne', 'być może',
      'jak widać', 'niestety', 'przypuszczam',
      'rzekłbyś', 'sądzę', 'wiadomo', 'zdaje się'
    ];

      let sentence = this.previousSentence.join(" ");
      let arrSentence;

      whenComma.forEach((word)=> {
        if(sentence.includes(" "+word+""))
        {
          const newSentence = sentence.replace(" "+word, ", "+word);
          arrSentence = newSentence.split(" ");
        };
      });
          
      function isLen()
      {
        let finalSentence = "";
        for(let i = 0; i<arrSentence.length; i++)
        {
          if(arrSentence[i+1] == ',')
          {
            finalSentence += arrSentence[i];
            continue;
          };
          if(i == arrSentence.length-1)
          {
            finalSentence += arrSentence[i];
            break;
          };
          finalSentence += arrSentence[i]+ " ";
        };
  
        notesText.innerHTML += finalSentence.charAt(0).toUpperCase() + finalSentence.slice(1)+". ";
      };
      if(!sentence) return;

      arrSentence && arrSentence.length > 0? isLen(): notesText.innerHTML += sentence.charAt(0).toUpperCase() + sentence.slice(1)+". ";
      this.previousSentence = [];
  }

  flag;

  microStart(e, speechRecognition, micro)
  {
    if(e['preventDefault']) e.preventDefault();
    if(!micro.classList?.contains("active")) micro.classList.add("active");

      speechRecognition.onresult = (event) => {
        this.previousSentence.push(event.results[0][0].transcript.toLowerCase());
      };

      speechRecognition.onend = () => {
        if(!this.flag) return;
        speechRecognition.start();
      }

    speechRecognition.start();
  }

  // nasłuchiwanie działania użytkownika (notes)  
  listenUser(notesText: HTMLElement): void
  {
    this.flag = false;

    const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    const speechRecognition = new webkitSpeechRecognition();

    speechRecognition.lang = 'pl-PL';
    const micro = document.getElementById("micro");
      this.flag = true;

      micro.addEventListener("touchstart", (e) => this.microStart(e, speechRecognition, micro))
      micro.addEventListener("touchend", () => {

        this.flag = false;

        speechRecognition.stop();
        micro.classList.remove("active");

        setTimeout(() => {
          this.write(notesText);
        }, 430);
      });

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

      if(this.flag) return;
      this.flag = true;

      if(e.keyCode == 75) // gdy użytkownik go naciśnie zaczynamy nasłuchiwać to co mówi przez mikrofon i to co mówi dodajemy do notatnika
      {
        this.microStart(this, speechRecognition, micro)
      };
    })

    window.addEventListener("keyup", (e) => {

      if(e.keyCode == 75) { // użytkownik skończył mówić do mikrofonu
        this.flag = false;

        speechRecognition.stop();
        micro.classList.remove("active");

        setTimeout(() => {
          this.write(notesText);
        }, 430);
        
      };
    })
  }

  // ustawiwamy style dla kolory, czcionki lub linijki
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
      case "color": return this.a4.style.color = data.worth;
      case "lines": return this.notesSettingsSubject.next([ { "lines": data.worth.checked } ]);
    };
  }
}