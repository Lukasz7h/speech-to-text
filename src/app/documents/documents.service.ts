import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';

import { backend } from '../backend/data';
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
    removeElement?: {right: number, left: number, top: number, bottom: number, html: HTMLElement}| any
  } = { editELement: {}, removeElement: {}}

  private actionElement: HTMLElement;
  private modifyElement: HTMLElement;

  constructor(
    private userExitService: UserExitFromPageService, private notesService: NotesService,
    private route: Router, private httpClient: HttpClient
    ) { }

  mouseMoveEvent(element: any): void
  {
    function showImage(element: HTMLElement)
    {
      const image = element.getElementsByTagName("img").item(0);
      if(this.currentImage && image == this.currentImage) return;

      function time()
      {
        this.timeOut = setTimeout(() => {
          if(this.currentImage) this.peepImage(this.currentImage);
        }, 850);
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
    };

    this.event = fromEvent(element, "mousemove")
    .subscribe((data: Event) => {

      if(data.target['parentElement'].classList.contains("hadImage")) showImage.call(this, data.target['parentElement']);
      else if(this.currentImage) removeFromCurrElement.call(this);
    });
  }

  mouseDownEvent(element: HTMLElement, editElement: HTMLElement, sizeElement: HTMLElement, removeElement: HTMLElement): void
  {
    let toMove;

    const check = (_element: EventTarget) => {
      toMove = _element['parentElement'];
      return _element['parentElement'].classList.contains("hadImage");
    };

    const that = this;

    function setCoords(thatElement, toEdit)
    {
      const toChange = toEdit == "editElement"? that.elementsCoords.editELement: that.elementsCoords.removeElement;

      toChange.right = thatElement.offsetLeft + thatElement.offsetWidth;
      toChange.left = thatElement.offsetLeft;

      toChange.top = thatElement.offsetTop;
      toChange.bottom = thatElement.offsetTop + thatElement.offsetHeight;

      toChange.html = thatElement;
    };

    function doIt(event: MouseEvent)
    {
      event.preventDefault();

      if(!check(event.target)) return;
      if(that.timeOut)
      {
        clearTimeout(that.timeOut);
        that.currentImage?.parentElement?.getElementsByTagName("span").item(0).classList.remove("anim_show");
      };

      that.flag = true;

      editElement.classList.add("show_edit");
      sizeElement.classList.add("move");

      removeElement.classList.add("show");

      setCoords(editElement, 'editElement');
      setCoords(removeElement, 'removeElement');

      that.event.unsubscribe();
      that.mouseMoveThatElement(event, toMove);
    };

    element.addEventListener("mousedown", doIt);
  }

  moveThatListener;
  cb;

  mouseMoveThatElement(event: MouseEvent, toMove: HTMLElement): void
  {
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    
    const that = this;

    function toDo(element)
    {
      if(!element){ 
        that.actionElement = undefined;
        return;
      };
      
      element.classList.add('action');
      that.actionElement = element;
    }

    function action(x: number, y: number): boolean | HTMLElement
    {
      //editeELement
      if(
        (x < that.elementsCoords.editELement.right && x > that.elementsCoords.editELement.left)
        && 
        (y < that.elementsCoords.editELement.bottom && y > that.elementsCoords.editELement.top)
      ) return that.elementsCoords.editELement.html;

      //deleteElement
      if(
        (x < that.elementsCoords.removeElement.right && x > that.elementsCoords.removeElement.left)
        && 
        (y < that.elementsCoords.removeElement.bottom && y > that.elementsCoords.removeElement.top)
      )return that.elementsCoords.removeElement.html;

      return false;
    };

    function moveThat(_event: MouseEvent)
    {
      const thatElement: HTMLElement = event.target['classList'].contains("hadImage")? event.target: event.target['parentElement'];
      that.modifyElement = thatElement;

      thatElement.style.position = 'fixed';
      thatElement.style.zIndex = "6";

      const marginLeft = 65;
      const marginTop = 50;

      thatElement.style.top = `${_event.clientY - offsetY - marginTop}px`;
      thatElement.style.left = `${_event.clientX - offsetX - marginLeft}px`;

      toDo(action(_event.screenX, _event.screenY));
    };

    this.moveThatListener = toMove;
    this.cb = moveThat;

    toMove.addEventListener("mousemove", moveThat);
  }

  mouseUp(element: HTMLElement, editElement: HTMLElement, sizeElement: HTMLElement, removeElement: HTMLElement)
  {
    const that = this;

    function canRemove(event: MouseEvent)
    {
      const thatElement: HTMLElement = event.target['classList'].contains("hadImage")? event.target: event.target['parentElement'];
      if(!thatElement.classList.contains('hadImage')) return;

      thatElement.style.position = "relative";
      thatElement.style.zIndex = '2';

      thatElement.style.top = '0';
      thatElement.style.left = '0';

      if(!that.flag) return;

      editElement.classList.remove("show_edit");
      sizeElement.classList.remove("move");

      if(!that.actionElement) removeElement.classList.remove("show");

      that.mouseMoveEvent(document.getElementById("inside"));

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
    this.modifyElement = undefined;

    this.route.navigate([""]);
  }

  removeElement(): void
  {
    const id: string = this.modifyElement.classList.item(1);

    this.httpClient.get(backend.url+"/remove/"+id, {withCredentials: true})
    .subscribe((data: any) => {
      if(data && data.remove) removeThatElement.call(this);
    });

    function removeThatElement()
    {
      function deleteAnimation()
      {
        for(let i=0; i<20; i++)
        {
          const span = document.createElement("span");
          span.classList.add("crush");

          this.actionElement.insertAdjacentElement("beforeend", span);
        };
      }

      deleteAnimation.apply(this);
      this.actionElement.classList.add("delete");

      setTimeout(() => {
        this.actionElement.classList.remove("delete");
        this.actionElement.classList.remove("action");

        this.actionElement.classList.remove("show");
        const index = this.documents.indexOf(this.documents.find(e => e.class == id));

        this.documents.splice(index, 1);
        this.files.splice(this.files.indexOf(this.currentImage.src), 1);

        const spans = Array.from(document.getElementById("removeFile").getElementsByClassName("crush"));
        spans.forEach((e) => e.remove());

        this.actionElement = undefined;
      }, 1000);
    };
  }

  fileAction(): void
  {
    if(!this.actionElement) {
      this.modifyElement.style.zIndex = '3';
      this.modifyElement = undefined;
      return;
    };

    switch(this.actionElement.id)
    {
      case "edit": this.editChosenElement();
      break;
      case "removeFile": this.removeElement();
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