import { AfterViewInit, Component } from '@angular/core';
import { NotesService } from '../notesService/notes.service';

@Component({
  selector: 'app-notes-to-file',
  templateUrl: './notes-to-file.component.html',
  styleUrls: ['./notes-to-file.component.css']
})
export class NotesToFileComponent implements AfterViewInit
{

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

  ngAfterViewInit(): void
  {
    
    let flag = false;

    const div = document.getElementById("fileDownload");
    const select = div.getElementsByTagName("select").item(0);

    div.addEventListener("mousemove", () => {
      if(flag) return;

      flag = true;
      div.classList.add("show");
      select.classList.add("showSelect");
    })

    div.addEventListener("mouseleave", (e) => {
      if(flag)
      {
        flag = false;
        setTimeout(() => {
          if(!flag){
            select.classList.remove("showSelect");
            div.classList.remove("show");
          }
        }, 2200);
      };
    })
  }
}