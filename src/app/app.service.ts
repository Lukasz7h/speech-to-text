import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Padding } from './padding.instance';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(){}

  private instances = {};
  private thatElement;

  public settingsSubject: Subject<{Top?: number, Left?: number, Bottom?: number, Right?: number}> = new Subject<{Top: number, Left: number, Bottom: number, Right: number}>();

  private diffrenceX;
  private diffrenceY;

  setPaddingX(element: HTMLElement): number
  {
    return element.offsetLeft > 0? element.offsetLeft + element.clientWidth: element.offsetLeft;
  }

  // tworzenie nowych instancji dla każdego elementu padding
  addInstance(elements: HTMLCollection): void
  {
    Array.from(elements).forEach((element: HTMLElement) => {
      const newInstance = new Padding();
      this.instances[`${element.getAttribute("data-padding")}`] = newInstance;
    });
  }

  private clientX: number;
  private clientY: number;

  private flag: boolean = false;

  getCoordsLocalStorage(padding: any)
  {
    const that = this;

    function set(data)
    {
      switch(data.position)
      {
        case "top": that.instances[`1`].setCoords(undefined, data.value), that.instances[`2`].setCoords(undefined, data.value);
        break;
        case "bottom": that.instances[`3`].setCoords(undefined, data.value), that.instances[`4`].setCoords(undefined, data.value);
        break;
        case "left": that.instances[`1`].setCoords(data.value, undefined), that.instances[`4`].setCoords(data.value, undefined);
        break;
        case "right": that.instances[`2`].setCoords(data.value, undefined), that.instances[`3`].setCoords(data.value, undefined);
        break;
      }

      document.querySelector(`[data-padding='${data.int}']`)['style'][`${data.position}`] = data.value+"px";
    }

    for(let key in padding)
    {
      switch(key)
      {
        case "Top": [set({int: 1, value: padding[`${key}`], position: "top"}), set({int: 2, value: padding[`${key}`], position: "top"})];
        break;
        case "Bottom": [set({int: 3, value: padding[`${key}`], position: "bottom"}), set({int: 4, value: padding[`${key}`], position: "bottom"})]
        break;
        case "Left": [set({int: 1, value: padding[`${key}`], position: "left"}), set({int: 4, value: padding[`${key}`], position: "left"})]
        break;
        case "Right": [set({int: 2, value: padding[`${key}`], position: "right"}), set({int: 3, value: padding[`${key}`], position: "right"})]
        break;
      }
    }
  }

  // ustawiamy nowe koordynaty dla paddingów
  mouseupEvent(data): void
  {
    this.flag = false;
    
    if(!this.thatElement || !this.thatElement.getAttribute("data-padding")) return;

    switch(this.thatElement.getAttribute("data-padding"))
    {
      case "1":
        this.instances[`1`].setCoords(this.diffrenceX, this.diffrenceY);
        this.instances[`2`].setCoords(undefined, this.diffrenceY);
        this.instances[`4`].setCoords(this.diffrenceX, undefined);
      break;
      case "2":
        this.instances[`1`].setCoords(undefined, this.diffrenceY);
        this.instances[`2`].setCoords(this.diffrenceX, this.diffrenceY);
        this.instances[`3`].setCoords(this.diffrenceX, undefined);
      break;
      case "3":
        this.instances[`4`].setCoords(undefined, this.diffrenceY);
        this.instances[`2`].setCoords(this.diffrenceX, undefined);
        this.instances[`3`].setCoords(this.diffrenceX, this.diffrenceY);
      break;
      case "4":
        this.instances[`1`].setCoords(this.diffrenceX, undefined);
        this.instances[`4`].setCoords(this.diffrenceX, this.diffrenceY);
        this.instances[`3`].setCoords(undefined, this.diffrenceY);
      break;
    };
  }

  mousedownEvent(data): void
  {
    if(!data.target.classList.contains("padding") && !data.target.parentElement.classList.contains("padding")) return;
    this.thatElement = data.target.classList.contains("padding")? data.target: data.target.parentElement;

    this.clientX = data.clientX;
    this.clientY = data.clientY;

    this.flag = true;

    if(!this.instances[`${this.thatElement.getAttribute("data-padding")}`].listener)
    this.instances[`${this.thatElement.getAttribute("data-padding")}`].listener = addEventListener("mousemove", this.moveElement.bind(this));
  }

  setStyle(elements: number[], data: {kind: string, diffrence: number}, position: string, some: number)
  {
    function checkDiffrance(): boolean
    {
      const allow = {
        x: 600,
        y: 950
      };

      let result = Math.abs(Number(this.instances[`${some}`][`${data.kind}`])) + Number(data.diffrence);
      return result > allow[`${data.kind}`]; 
    };

    if((position == "Right" || position == "Left") && checkDiffrance.call(this)) return;
    if((position == "Top" || position == "Bottom") && checkDiffrance.call(this)) return;

    if(data.diffrence < 0) return;

    elements.forEach((id: number) => {
      document.querySelector(`[data-padding='${id}']`)['style'][`${position.toLowerCase()}`] = `${data.diffrence}px`;
      document.querySelector(`[data-padding='${id}']`)['style'][`${position.toLowerCase()}`] = `${data.diffrence}px`;
    });

    if(data.kind == "x")
    {
      position == "Left"? this.settingsSubject.next({Left: data.diffrence}): this.settingsSubject.next({Right: data.diffrence})
    }
    else
    {
      position == "Top"? this.settingsSubject.next({Top: data.diffrence}): this.settingsSubject.next({Bottom: data.diffrence});
    };
  }

  moveElement(data): void
  {
    if(!this.flag) return;
    const elementAttribute = this.thatElement.getAttribute("data-padding");

    // ustawiamy różnice dla osi x i y o jaką nasz element będzie się poruszał
    elementAttribute == 2 || elementAttribute == 3?
    this.diffrenceX = this.clientX - data.clientX: this.diffrenceX = data.clientX - this.clientX;

    elementAttribute == 1 || elementAttribute == 2?
    this.diffrenceY = this.clientY - data.clientY: this.diffrenceY = data.clientY - this.clientY;

    // aktualizowanie wartości różnicy dla osi x lub y (jeśli padding danego elementy był już zmieniany)
    if(this.instances[`${elementAttribute}`].x && this.instances[`${elementAttribute}`].x > 0)
    this.diffrenceX += Number(this.instances[`${elementAttribute}`].x);

    if(this.instances[`${elementAttribute}`].y)
    this.diffrenceY += this.instances[`${elementAttribute}`].y > 0?
    -this.instances[`${elementAttribute}`].y:
    this.instances[`${elementAttribute}`].y;

    // ustawianie stylu (oś x)
    (elementAttribute == 2 || elementAttribute == 3)?
    this.setStyle([2, 3], {kind: "x", diffrence: this.diffrenceX}, "Right", 1):
    this.setStyle([1, 4], {kind: "x", diffrence: this.diffrenceX}, "Left", 2);

    // ustawianie stylu (oś y)
    (elementAttribute == 3 || elementAttribute == 4)?
    this.setStyle([3, 4], {kind: "y", diffrence: -this.diffrenceY}, "Bottom", 1):
    this.setStyle([1, 2], {kind: "y", diffrence: -this.diffrenceY}, "Top", 4);
  }
}