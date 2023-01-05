import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import html2canvas from 'html2canvas';
import { backend } from '../backend/data';

@Injectable({
  providedIn: 'root'
})
export class SaveDocService {

  constructor(private httpClient: HttpClient) {}

  saveDoc()
  {
    const a4 = document.getElementById("a4");

    const formData = new FormData();

    html2canvas(a4)
    .then((canvas) => {
      formData.append("doc", a4.innerHTML);
      formData.append("img", canvas.toDataURL("image/png"));

      this.httpClient.post(backend.url+"/save", formData, {withCredentials: true})
      .subscribe((e: any) => {
        console.log(e)
      });
    })

    
  }
}
