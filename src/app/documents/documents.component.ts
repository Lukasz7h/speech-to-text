import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { backend } from '../backend/data';
import * as html2canvas from "html2canvas";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit
{

  files = [];

  constructor(private httpClient: HttpClient){}

  ngOnInit(): void
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
          console.log(x)
        })
      }
    });
  }
}