import { Injectable } from '@angular/core';
import { Padding } from './padding.instance';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  instances = {}
  thatElement;

  diffrence;

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
    this.instances[`${this.thatElement.getAttribute("data-padding")}`].setCoords(this.diffrence, 0)
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

  moveElement(data): void
  {
    if(!this.flag) return;

    Number(this.thatElement.getAttribute("data-padding")) == 2 ||  Number(this.thatElement.getAttribute("data-padding")) == 3?
    this.diffrence = this.clientX - data.clientX:
    this.diffrence = data.clientX - this.clientX;

    if(this.instances[`${this.thatElement.getAttribute("data-padding")}`].x) this.diffrence += this.instances[`${this.thatElement.getAttribute("data-padding")}`].x;
    if(this.diffrence <= 0) return;

    Number(this.thatElement.getAttribute("data-padding")) == 2 ||  Number(this.thatElement.getAttribute("data-padding")) == 3?
    this.thatElement.style.right = `${this.diffrence}px`:
    this.thatElement.style.left = `${this.diffrence}px`;
  }
}