import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { fromEvent, Subscription } from 'rxjs';
import { UserExitFromPageService } from '../notes/userExit/user-exit-from-page.service';

import { NotesService } from '../notesService/notes.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  public files = [];
  public documents: any = [];

  private flag: boolean;
  private timeOut;

  private currentImage: HTMLImageElement | any;
  private event: Subscription;

  private elementsCoords: {
    editELement?: {right: number, left: number, top: number, bottom: number, html: HTMLElement} | any,
    sizeElement?: {right: number, left: number, top: number, bottom: number, html: HTMLElement}| any
  } = { editELement: {}, sizeElement: {}}

  private actionElement: HTMLElement;
  private modifyElement: HTMLElement;

  constructor(private userExitService: UserExitFromPageService, private notesService: NotesService, private route: Router) { }

  mousemoveEvent(element: any): void
  {
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

    function setCoords(thatElement, toEdit)
    {
      const toChange = toEdit == "editElement"? that.elementsCoords.editELement: that.elementsCoords.sizeElement;

      toChange.right = thatElement.offsetLeft + thatElement.offsetWidth;
      toChange.left = thatElement.offsetLeft;

      toChange.top = thatElement.offsetTop;
      toChange.bottom = thatElement.offsetTop + thatElement.offsetHeight;

      toChange.html = thatElement;
      that.actionElement = thatElement;
    };

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

      setCoords(editElement, 'editElement');
      setCoords(sizeElement, 'sizeElement');

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

    const that = this;

    function toDo(element)
    {
      if(!element) return;
      element.classList.add('action');

      that.actionElement = element;
    }

    function action(x: number, y: number): void | boolean | HTMLElement
    {
      return ( x < that.elementsCoords.editELement.right && x > that.elementsCoords.editELement.left)? //editeELement
      (y < that.elementsCoords.editELement.bottom && y > that.elementsCoords.editELement.top)? that.elementsCoords.editELement.html:
      (x < that.elementsCoords.sizeElement.right && x > that.elementsCoords.sizeElement.left)? //deleteElement
      (y < that.elementsCoords.sizeElement.bottom && y > that.elementsCoords.sizeElement.top)? that.elementsCoords.sizeElement.html:
      false: false: false;
    };

    function moveThat(_event: MouseEvent)
    {
      const thatElement: HTMLElement = event.target['classList'].contains("hadImage")? event.target: event.target['parentElement'];
      that.modifyElement = thatElement;

      thatElement.style.position = 'absolute';

      thatElement.style.top = `${_event.clientY - offsetY}px`;
      thatElement.style.left = `${_event.clientX - offsetX}px`;

      toDo(action(_event.screenX, _event.screenY));
    };

    this.moveThatListener = event.target;
    this.cb = moveThat;

    event.target.addEventListener("mousemove", moveThat);
  }

  mouseUp(element: HTMLElement, editElement: HTMLElement, sizeElement: HTMLElement)
  {
    const that = this;

    function canRemove(event: MouseEvent)
    {
      const thatElement: HTMLElement = event.target['classList'].contains("hadImage")? event.target: event.target['parentElement'];
      
      thatElement.style.position = "relative";

      thatElement.style.top = '0';
      thatElement.style.left = '0';

      if(!that.flag) return;

      editElement.classList.remove("show_edit");
      sizeElement.classList.remove("move");

      that.mousemoveEvent(document.getElementById("inside"));
      if(that.moveThatListener) that.moveThatListener.removeEventListener("mousemove", that.cb);

      that.fileAction();
    };

    element.addEventListener("mouseup", canRemove);
  }

  editChosenElement()
  {
    const item = this.documents.filter((x) => x.class == this.modifyElement.classList.item(1))[0].doc;

    const html = document.createElement("div");
    html.innerHTML = item;

    const div = html.getElementsByTagName("div").item(0);
    const notes = html.getElementsByTagName("div").item(0).textContent;

    this.notesService.settings.fontSize = div.style.fontSize.match(/\d/g).join("");
    this.notesService.settings.letterSpacing = div.style.letterSpacing.match(/\d/g).join("");

    this.notesService.settings.letterHeight = div.style.lineHeight.match(/\d/g).join("");

    this.notesService.settings.padding.Top = div.style.paddingTop.match(/\d/g).join("");
    this.notesService.settings.padding.Left = div.style.paddingLeft.match(/\d/g).join("");

    this.notesService.settings.padding.Bottom = div.style.paddingBottom.match(/\d/g).join("");
    this.notesService.settings.padding.Right = div.style.paddingRight.match(/\d/g).join("");

    this.userExitService.userExit({settings: this.notesService.settings, notes});
    this.route.navigate(["**"]);
  }

  fileAction()
  {
    if(!this.actionElement) return;
    switch(this.actionElement.id)
    {
      case "edit": this.editChosenElement();
      break;
    }
  };

  peepImage(image: HTMLImageElement): void
  {
    const img = document.createElement("img");
    img.src = image.src;

    img.id = "show";
    document.body.insertAdjacentElement("afterbegin", img);
  }
}