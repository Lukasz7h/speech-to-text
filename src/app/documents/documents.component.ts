import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { backend } from '../backend/data';
import { DocumentsService } from './documents.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements AfterViewInit, OnDestroy
{
  isEnd: boolean;
  size: number;

  constructor(private httpClient: HttpClient, public documentService: DocumentsService, private changeDetRef: ChangeDetectorRef){}

  @ViewChild("inside")
  filesElement: ElementRef;

  @ViewChild("editNotes")
  editElement: ElementRef;

  @ViewChild("sizeElement")
  sizeElement: ElementRef;

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

      if(this.filesElement)
      {
        this.documentService.mousemoveEvent(this.filesElement.nativeElement);
        this.documentService.mousedownEvent(this.filesElement.nativeElement, this.editElement.nativeElement, this.sizeElement.nativeElement);
        this.documentService.mouseUp(this.filesElement.nativeElement, this.editElement.nativeElement, this.sizeElement.nativeElement);
      };
    });
  }
}