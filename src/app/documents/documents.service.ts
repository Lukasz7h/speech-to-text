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

  protected listener: boolean = false;

  constructor(
    private userExitService: UserExitFromPageService, private notesService: NotesService,
    private route: Router, private httpClient: HttpClient
    ) { }

  // nasłuchiwany jest ruch myszki użytkownika i czy zatrzymuje się na jednym z jego plików
  mouseMoveEvent(element: any): void
  {
    function showImage(element: HTMLElement)
    {
      const image = element.getElementsByTagName("img").item(0);
      if(this.currentImage && image == this.currentImage) return;

      // po podanym czasie pojawi się podgląd pliku użytkownika
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

    function doIt(event: MouseEvent | any)
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
    element.addEventListener("touchstart", doIt);
  }

  moveThatListener;
  cb;

  // użytkownika porusza wybranym plikiem
  mouseMoveThatElement(event: MouseEvent | any, toMove: HTMLElement): void
  {
    const offsetX = event.offsetX? event.offsetX: Number(event.touches[0].clientX);
    const offsetY = event.offsetY? event.offsetY: Number(event.touches[0].clientY);
    
    const that = this;
    that.currentImage = toMove.getElementsByTagName("img").item(0);

    function toDo(element)
    {
      if(!element){ 
        that.actionElement = undefined;
        return;
      };
      
      element.classList.add('action');
      that.actionElement = element;
    };

    // sprawdzamy czy użytkownik wybrał jedną z akcji dla swojego pliku
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

    // plik naciśnięty przez użytkownika porusza się za kursorem
    function moveThat(_event: MouseEvent | any)
    {
      const thatElement: HTMLElement = event.target['classList'].contains("hadImage")? event.target: event.target['parentElement'];
      that.modifyElement = thatElement;

      thatElement.style.position = 'fixed';
      thatElement.style.zIndex = "6";

      const marginLeft = 65;
      const marginTop = 50;

      const x = _event.clientX? _event.clientX: Number(_event.touches[0].clientX);
      const y = _event.clientY? _event.clientY: Number(_event.touches[0].clientY);

      _event.clientY? thatElement.style.top = `${y - offsetY - marginTop}px`: thatElement.style.top = `${y - marginTop}px`;
      _event.clientX? thatElement.style.left = `${x - offsetX - marginLeft}px`: thatElement.style.left = `${x - marginLeft}px`;

      toDo(action(x, y));
    };

    this.moveThatListener = toMove;
    this.cb = moveThat;

    toMove.addEventListener("mousemove", moveThat);
    toMove.addEventListener("touchmove", moveThat);
  }

  // jeśli użytkownik przestał poruszać plikiem przywracamy jego style
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
    element.addEventListener("touchend", canRemove);
  }

  // edytujemy style dla pliku który będzie modyfikowany
  editChosenElement()
  {
    const item = this.documents.filter((x) => x.class == this.modifyElement.classList.item(1))[0].doc;

    const html = document.createElement("div");
    html.innerHTML = item;

    const div = html.getElementsByTagName("div").item(0);
    const notes = html.getElementsByTagName("div").item(0).textContent;

    this.notesService.settings.fontSize = div.style.fontSize.replace(/[^\d.-]/g, '');
    this.notesService.settings.letterSpacing = div.style.letterSpacing.replace(/[^\d.-]/g, '');

    this.notesService.settings.letterHeight = div.style.lineHeight.replace(/[^\d.-]/g, '');

    this.notesService.settings.padding.Top = div.style.paddingTop.replace(/[^\d.-]/g, '');
    this.notesService.settings.padding.Left = div.style.paddingLeft.replace(/[^\d.-]/g, '');

    this.notesService.settings.padding.Bottom = div.style.paddingBottom.replace(/[^\d.-]/g, '');
    this.notesService.settings.padding.Right = div.style.paddingRight.replace(/[^\d.-]/g, '');

    this.userExitService.userExit({settings: this.notesService.settings, notes});
    this.modifyElement = undefined;

    this.route.navigate([""]);
  }

  // usuwamy plik wybrany przez użytkownika
  removeElement(): void
  {
    const id: string = this.modifyElement.classList.item(1);

    this.httpClient.get(backend.url+"/remove/"+id, {withCredentials: true})
    .subscribe((data: any) => {
      if(data && data.remove) removeThatElement.call(this);
    });

    function removeThatElement()
    {

      // animacja usuwania
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

      // po animacji aktualizujemy widok
      setTimeout(() => {
        this.actionElement.classList.remove("delete");
        this.actionElement.classList.remove("action");

        this.actionElement.classList.remove("show");
        const index = this.documents.indexOf(this.documents.find(e => e.class == id));

        const e = this.documents.splice(index, 1);
        this.files.splice(this.files.indexOf(this.currentImage.src), 1);

        const spans = Array.from(document.getElementById("removeFile").getElementsByClassName("crush"));
        spans.forEach((e) => e.remove());

        this.actionElement = undefined;
      }, 1000);
    };
  }

  // wykonujemy stosowną akcje dla wybranego pliku
  fileAction(): void
  {
    if(!this.actionElement)
    {
      if(!this.modifyElement) return;

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

  // podglądamy widok danego pliku
  peepImage(image: HTMLImageElement): void
  {
    const img = document.createElement("img");
    img.src = image.src;

    img.id = "show";
    document.body.insertAdjacentElement("afterbegin", img);
  }

  // usuwanie wszystkich plików
  delete(elements)
  {
    const ArrayId = Array.from(elements).map((e: HTMLElement) => e.classList.item(1));
    const formData = new FormData();

    formData.append("files", JSON.stringify(ArrayId));
    
    this.httpClient.post(backend.url+"/deleteFiles", formData, {withCredentials: true})
    .subscribe((e: any) => {
      if(e.remove){

        document.getElementById("inside").textContent = "";

        this.files = [];
        this.documents = [];
      }
    })
  }
}