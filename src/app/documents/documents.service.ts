import { Injectable } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { SafeSubscriber, Subscriber } from 'rxjs/internal/Subscriber';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  private flag: boolean;
  private timeOut;

  private currentImage: HTMLImageElement | any;
  private event: Subscription;

  constructor() { }

  mousemoveEvent(element: any): void
  {
    console.log(element)
    function showImage(element: HTMLElement)
    {
      const image = element.getElementsByTagName("img").item(0);
     if(this.currentImage && image == this.currentImage) return;

     function time()
     {
      this.timeOut = setTimeout(() => {
        if(this.currentImage) this.peepImage(this.currentImage);
      }, 1400);
     };

      this.currentImage = image;
      element.getElementsByTagName("span").item(0).classList.add("anim_show");

      time.call(this);
    };

    function removeFromCurrElement()
    {
      if(this.timeOut) clearTimeout(this.timeOut);

      const show = document.getElementById("show");
      if(show) show.remove();

      this.currentImage.parentElement.getElementsByTagName("span").item(0).classList.remove("anim_show");
      this.currentImage = undefined;
    }

    this.event = fromEvent(element, "mousemove")
    .subscribe((data: Event) => {

      if(data.target['parentElement'].classList.contains("hadImage")) showImage.call(this, data.target['parentElement']);
      else if(this.currentImage) removeFromCurrElement.call(this);
    });
  }

  mousedownEvent(element: HTMLElement, editElement: HTMLElement, sizeElement: HTMLElement): void
  {
    const check = (_element: EventTarget) => _element['parentElement'].classList.contains("hadImage");
    const that = this;

    function doIt(event: MouseEvent)
    {
      event.preventDefault();

      if(!check(event.target)) return;
      if(that.timeOut)
      {
        clearTimeout(that.timeOut);
        that.currentImage.parentElement.getElementsByTagName("span").item(0).classList.remove("anim_show");
      };

      that.flag = true;

      editElement.classList.add("show_edit");
      sizeElement.classList.add("move");

      that.event.unsubscribe();
      that.mouseMoveThatElement(event);
    };

    element.addEventListener("mousedown", doIt);
  }

  moveThatListener;
  cb;

  mouseMoveThatElement(event: MouseEvent): void
  {
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;

    function moveThat(_event: MouseEvent)
    {
      const that: HTMLElement = event.target['classList'].contains("hadImage")? event.target: event.target['parentElement'];

      that.style.position = 'absolute';

      that.style.top = `${_event.clientY - offsetY}px`;
      that.style.left = `${_event.clientX - offsetX}px`;
    }

    this.moveThatListener = event.target;
    this.cb = moveThat;

    event.target.addEventListener("mousemove", moveThat);
  }

  mouseUp(element: HTMLElement, editElement: HTMLElement, sizeElement: HTMLElement)
  {
    const that = this;

    function canRemove()
    {
      if(!that.flag) return;

      editElement.classList.remove("show_edit");
      sizeElement.classList.remove("move");

      that.mousemoveEvent(document.getElementById("inside"));
      if(that.moveThatListener) that.moveThatListener.removeEventListener("mousemove", that.cb);
    };

    element.addEventListener("mouseup", canRemove);
  }

  peepImage(image: HTMLImageElement): void
  {
    const img = document.createElement("img");
    img.src = image.src;

    img.id = "show";
    document.body.insertAdjacentElement("afterbegin", img);
  }
}