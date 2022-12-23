import { Component } from '@angular/core';
import {  } from "@angular/material/icon"
import { NotesService } from '../notesService/notes.service';

@Component({
  selector: 'app-notes-to-file',
  templateUrl: './notes-to-file.component.html',
  styleUrls: ['./notes-to-file.component.css']
})
export class NotesToFileComponent {

  constructor(private notesService: NotesService){}

  documentTypes: string[] = ["pdf", "docx"];

  createDocument(type: string): void
  {
    switch(type)
    {
      case "pdf": this.notesService.createPDF();
      break;
      case "docx": this.notesService.createDOCX();
      break;
    }
  }
}