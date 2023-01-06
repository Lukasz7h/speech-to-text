import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { backend } from '../backend/data';
import * as html2canvas from "html2canvas";
import { DocumentsService } from './documents.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit, AfterViewInit
{

  files = [];

  constructor(private httpClient: HttpClient, private documentService: DocumentsService){}

  ngOnInit(): void
  {
    this.getFiles();
  }

  @ViewChild("container")
  element: ElementRef;

  ngAfterViewInit(): void
  {
    this.documentService.mousemoveEvent(this.element.nativeElement);
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
    });
  }
}