import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';

import { backend } from '../backend/data';
import { DocumentsService } from './documents.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements AfterViewInit
{
  files = [];

  constructor(private httpClient: HttpClient, private documentService: DocumentsService, private changeDetRef: ChangeDetectorRef){}

  @ViewChild("container")
  element: ElementRef;

  ngAfterViewInit(): void
  {
    this.getFiles();
  }

  getFiles()
  {
    this.httpClient.get(backend.url+"/files", {withCredentials: true})
    .subscribe((e) => {
      if(e instanceof Array)
      {
        e.forEach((x) => {
          this.files.push(x.img);
        })
      }

      this.changeDetRef.detectChanges();
      if(this.element) this.documentService.mousemoveEvent(this.element.nativeElement);
    });
  }
}