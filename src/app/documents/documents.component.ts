import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import { backend } from '../backend/data';
import { DocumentsService } from './documents.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements AfterViewInit, OnDestroy
{
  protected isEnd: boolean;
  protected size: number;

  private maxSize: number = 5; //MB

  constructor(private httpClient: HttpClient, public documentService: DocumentsService, private changeDetRef: ChangeDetectorRef){}

  @ViewChild("inside")
  private filesElement: ElementRef;

  @ViewChild("editNotes")
  private editElement: ElementRef;

  @ViewChild("sizeElement")
  private sizeElement: ElementRef;

  @ViewChild("vial")
  private vialElement: ElementRef;

  @ViewChild("liquid")
  private liquidElement: ElementRef;

  @ViewChild("remove")
  private removeElement: ElementRef;

  ngAfterViewInit(): void {
    this.getFiles();
  }

  ngOnDestroy(): void {
    const showImage = document.getElementById("show");
    if(showImage) showImage.remove();
  }

  getFiles()
  {
    this.httpClient.get(backend.url+"/files", {withCredentials: true})
    .subscribe((e: {files: [], size: number}) => {

      this.size = Math.round((e.size / 1000 / 1024) * 100) / 100;

      if(e.files instanceof Array)
      {
        this.documentService.files = [];
        this.documentService.documents = [];
        
        e.files.forEach((x: any) => {
          this.documentService.files.push(x.img);
          this.documentService.documents.push({class: x.name, doc: x.document});
        })
      }

      this.isEnd = true;
      this.changeDetRef.detectChanges();

      function setFileSizeStyle()
      {
        const filesSizeInProcent = Math.ceil( this.size / this.maxSize * 100);
        this.liquidElement.nativeElement.style.height = `${filesSizeInProcent}%`;
        
        this.vialElement.nativeElement.getElementsByTagName("span").item(0).textContent = `${filesSizeInProcent}%`;
        this.vialElement.nativeElement.getElementsByTagName("span").item(0).style.zIndex = `5`;
      };

      if(this.filesElement)
      {
        setFileSizeStyle.call(this);

        this.documentService.mouseMoveEvent(this.filesElement.nativeElement);
        this.documentService.mouseDownEvent(this.filesElement.nativeElement, this.editElement.nativeElement, this.sizeElement.nativeElement, this.removeElement.nativeElement);
        this.documentService.mouseUp(this.filesElement.nativeElement, this.editElement.nativeElement, this.sizeElement.nativeElement, this.removeElement.nativeElement);
      };
    });
  }

  deleteAll()
  {
    this.documentService.delete(document.getElementsByClassName("hadImage"));
  }
  
}