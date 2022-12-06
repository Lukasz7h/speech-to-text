import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notesSettingsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({fontSize: 20});

  constructor() {}

  createPDF(a4: HTMLElement, settings: any)
  {
    console.log(a4.textContent);
    const pdf = new jsPDF("p", "mm", [297, 210]);
    pdf.text(a4.textContent, settings.padding.left, settings.padding.top < 5? settings.padding.top + 5: settings.padding.top);
    pdf.save("some.pdf");
  }
}