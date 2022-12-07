import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Padding } from './padding.instance';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(){}

  instances = {};
  thatElement;

  settingsSubject: Subject<{Top?: number, Left?: number, Bottom?: number, Right?: number}> = new Subject<{Top: number, Left: number, Bottom: number, Right: number}>();

  diffrenceX;
  diffrenceY;

  setPaddingX(element: HTMLElement): number
  {
    return element.offsetLeft > 0? element.offsetLeft + element.clientWidth: element.offsetLeft;
  }

  addInstance(elements: HTMLCollection): void
  {
    Array.from(elements).forEach((element: HTMLElement) => {
      const newInstance = new Padding();
      this.instances[`${element.getAttribute("data-padding")}`] = newInstance;
    });
  }

  clientX: number;
  clientY: number;

  flag: boolean = false;

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

  setStyle(elements: number[], data: {kind: string, diffrence: number}, position: string)
  {
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

    // ustawiamy różnice dla osi x i y o jaką nasz element będzie się poruszał
    this.thatElement.getAttribute("data-padding") == 2 || this.thatElement.getAttribute("data-padding") == 3?
    this.diffrenceX = this.clientX - data.clientX: this.diffrenceX = data.clientX - this.clientX;

    this.thatElement.getAttribute("data-padding") == 1 || this.thatElement.getAttribute("data-padding") == 2?
    this.diffrenceY = this.clientY - data.clientY: this.diffrenceY = data.clientY - this.clientY;

    // aktualizowanie wartości różnicy dla osi x lub y (jeśli padding danego elementy był już zmieniany)
    if(this.instances[`${this.thatElement.getAttribute("data-padding")}`].x) this.diffrenceX += this.instances[`${this.thatElement.getAttribute("data-padding")}`].x;
    if(this.instances[`${this.thatElement.getAttribute("data-padding")}`].y) this.diffrenceY += this.instances[`${this.thatElement.getAttribute("data-padding")}`].y;

    // ustawianie stylu (oś x)
    (this.thatElement.getAttribute("data-padding") == 2 || this.thatElement.getAttribute("data-padding") == 3)?
    this.setStyle([2, 3], {kind: "x", diffrence: this.diffrenceX}, "Right"):
    this.setStyle([1, 4], {kind: "x", diffrence: this.diffrenceX}, "Left");
    
    // ustawianie stylu (oś y)
    (this.thatElement.getAttribute("data-padding") == 3 || this.thatElement.getAttribute("data-padding") == 4)?
    this.setStyle([3, 4], {kind: "y", diffrence: -this.diffrenceY - 20}, "Bottom"):
    this.setStyle([1, 2], {kind: "y", diffrence: -this.diffrenceY}, "Top");
  }
}