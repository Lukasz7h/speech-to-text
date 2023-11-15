import { Component } from '@angular/core';
import { NotesService } from '../notesService/notes.service';

@Component({
  selector: 'app-notes-to-file',
  templateUrl: './notes-to-file.component.html',
  styleUrls: ['./notes-to-file.component.css']
})
export class NotesToFileComponent
{

  constructor(private notesService: NotesService){}
  protected documentTypes: string[] = ["pdf", "docx"]

  createDocument(type: string, name: string): void
  {
    switch(type)
    {
      case "pdf": this.notesService.createPDF(name);
      break;
      case "docx": this.notesService.createDOCX(name);
      break;
    }
  }

}