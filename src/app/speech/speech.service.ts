import { Injectable } from '@angular/core';

// objekt który używamy do nasłuchiwania mikrofonu użytkownika
export interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
};

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  constructor() { }

  previousSentence = [];
  flag;

  private whenComma = [
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

  write(notesText)
  {

    let sentence = this.previousSentence.join(" ");
    let arrSentence;

    this.whenComma.forEach((word) => {
      if (sentence.includes(" " + word + "")) {
        const newSentence = sentence.replace(" " + word, ", " + word);
        arrSentence = newSentence.split(" ");
      };
    });

    function isLen()
    {

      let finalSentence = "";

      for (let i = 0; i < arrSentence.length; i++)
      {
        if (arrSentence[i + 1] == ',') {
          finalSentence += arrSentence[i];
          continue;
        };
        if (i == arrSentence.length - 1) {
          finalSentence += arrSentence[i];
          break;
        };

        finalSentence += arrSentence[i] + " ";
      };

      notesText.innerHTML += finalSentence.charAt(0).toUpperCase() + finalSentence.slice(1) + ". ";
    };
    if (!sentence) return;

    arrSentence && arrSentence.length > 0 ? isLen() : notesText.innerHTML += sentence.charAt(0).toUpperCase() + sentence.slice(1) + ". ";
    this.previousSentence = [];
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

    micro.addEventListener("touchstart", (e) => this.microStart(e, speechRecognition, micro, true))
    micro.addEventListener("touchend", () => {

      this.flag = false;

      speechRecognition.stop();
      micro.classList.remove("active");

      setTimeout(() => {
        this.write(notesText);
      }, 430);
    });

    window.addEventListener("keydown", (e) => {

      if (e.target['id'] == "notesText" && e.key == "Tab") // jeśli użytkownik nacisnął tab w notatniku
      {
        e.preventDefault();

        const doc = e.target['ownerDocument'].defaultView;
        const sel = doc.getSelection();

        const range = sel.getRangeAt(0);
        const tabNode = document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0');

        range.insertNode(tabNode);
        range.setStartAfter(tabNode);

        range.setEndAfter(tabNode);
        sel.removeAllRanges();
        sel.addRange(range);
      };

      if (this.flag) return;
      this.flag = true;

      console.log(e.keyCode)
      // gdy użytkownik go naciśnie zaczynamy nasłuchiwać to co mówi przez mikrofon i to co mówi dodajemy do notatnika
      if (e.keyCode == 75 || e.keyCode == 76) this.microStart(this, speechRecognition, micro, e.keyCode == 75);
    })

    window.addEventListener("keyup", (e) => {

      if (e.keyCode == 75 || e.keyCode == 76) // użytkownik skończył mówić do mikrofonu
      {
        this.flag = false;

        speechRecognition.stop();
        micro.classList.remove("active");

        setTimeout(() => {
          this.write(notesText);
        }, 430);

      };
    })
  }



  // słowa użytkownika zamieniane sa na tekst
  toText(e, speechRecognition)
  {
    speechRecognition.onresult = (event) => {
      this.previousSentence.push(event.results[0][0].transcript.toLowerCase());
    };

    speechRecognition.onend = () => {
      if (!this.flag) return;
      speechRecognition.start();
    }

    speechRecognition.start();
  }


  
  // użytkownik zaczyna mówić
  microStart(e, speechRecognition, micro, flag) {

    if (e['preventDefault']) e.preventDefault();
    if (!micro.classList?.contains("active")) micro.classList.add("active");

    flag? this.toText(e, speechRecognition): this.helper(e, speechRecognition)
  }



  divideSentence(sentence: string, obj: Map<string, number | any>)
  {
    const that =  obj.get(`${ sentence.split(" ").filter((e) => !!obj.has(`${e}`)) }`);
    return that? that: false;
  }



  // pomocnik odpowiada za wysłuchiwanie komend i wdrażanie je w życie
  helper(e, speechRecognition)
  {

    function action(data: {number: number, divide: boolean} | number, term)
    {
      const that = term == 1? ['innerText', '.']: ['innerText', '\n'];
      const textArr: string[] = document.getElementById("notesText")[`${that[0]}`].replaceAll(".", ".{specjal-code-00}").split("{specjal-code-00}");

      console.log(textArr);

      if(data['divide']) data = Math.round(textArr.length * data['number']);
      data = Number(data);

      !term? textArr?.splice(!data? data: data-1, term, that[1]): textArr?.splice(data-1, term);
      document.getElementById("notesText")[`${that[0]}`] = textArr?.join('');
    }

    speechRecognition.onresult = (event) => {

      const res: string = event.results[0][0].transcript.toLowerCase();

      console.log(res)
      const term = conditions[`${Object.keys(conditions).find((e: string) => res.includes(e))}`]
      
      res.split(" ").every((e) => {
        const found: number | {number: number, divide: boolean} | undefined = numbers.get(e) || places.get(e);

        if(found){
          action(found, term);
          return false;
        }

        return true;
      });
    };

    speechRecognition.start();
  }

}


const numbers = new Map([
  ["pierwsze", 1],
  ["drugie", 2],
  ["trzecie", 3],
  ["czwarte", 4],
  ["piąte", 5],
  ["szóste", 6],
  ["siódme", 7],
  ["ósme", 8],
  ["dzięwiąte", 9]
])


const places = new Map([
  ["pierwsze", {number: 0, divide: true}],
  ["początku", {number: 0, divide: true}],

  ["środku", {number: 0.5, divide: true}],
  ["środkowe", {number: 0.5, divide: true}],

  ["końcu", {number: 1, divide: true}],
  ["ostatnie", {number: 1, divide: true}]
])
  

const conditions = {
  'usuń': 1,
  'spację': 0
};


const spans = new Map([
  ["zdanie", 1]
])