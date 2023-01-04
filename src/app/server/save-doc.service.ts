import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { backend } from '../backend/data';

@Injectable({
  providedIn: 'root'
})
export class SaveDocService {

  constructor(private httpClient: HttpClient) {}

  saveDoc()
  {
    const a4 = document.getElementById("a4").innerHTML;
    const formData = new FormData();

    formData.append("doc", a4);
    this.httpClient.post(backend.url+"/save", formData, {withCredentials: true})
    .subscribe((e) => {
      console.log(e)
    });
  }
}
