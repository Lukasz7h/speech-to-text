import { Injectable, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor() { }

  mousemoveEvent(element: any): void
  {
    let currentImage: HTMLImageElement | any;
    let timeOut;

    function showImage(element: HTMLElement)
    {
      const image = element.getElementsByTagName("img").item(0);
     if(currentImage && image == currentImage) return;

     function time()
     {
      timeOut = setTimeout(() => {
        if(currentImage) this.peepImage(currentImage);
      }, 1400);
     };

      currentImage = image;
      element.getElementsByTagName("span").item(0).classList.add("anim_show");
      time.call(this);
    };

    function removeFromCurrElement()
    {
      if(timeOut) clearTimeout(timeOut);

      const show = document.getElementById("show");
      if(show) show.remove();

      currentImage.parentElement.getElementsByTagName("span").item(0).classList.remove("anim_show");
      currentImage = undefined;
    }

    fromEvent(element, "mousemove")
    .subscribe((data: Event) => {
      if(data.target['parentElement'].classList.contains("hadImage")) showImage.call(this, data.target['parentElement']);
      else if(currentImage) removeFromCurrElement();
    })
  }

  peepImage(image: HTMLImageElement): void
  {
    const img = document.createElement("img");
    img.src = image.src;

    img.id = "show";

    document.body.insertAdjacentElement("afterbegin", img);
  }
}