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
  documentTypes: string[] = ["pdf", "docx"]

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

  ngAfterViewInit(): void
  {
    let flag = false;

    const div = document.getElementById("fileDownload");
    const select = div.getElementsByTagName("select").item(0);

    const inpName = div.getElementsByTagName("input").item(0);
    const label = div.getElementsByTagName("label").item(0);

    div.addEventListener("mousemove", () => {
      if(flag) return;

      flag = true;
      if(div.classList.contains("remove")) div.classList.remove("remove");

      div.classList.add("show");
      select.classList.add("showSelect");

      inpName.classList.add("showName");
      label.classList.add("showName");
    });

    div.addEventListener("mouseleave", (e) => {
      if(flag)
      {
        flag = false;
        setTimeout(() => {
          if(!flag){
            div.classList.add("remove");

            select.classList.remove("showSelect");
            div.classList.remove("show");

            inpName.classList.remove("showName");
            label.classList.remove("showName");
          }
        }, 2200);
      };
    });
  }
}