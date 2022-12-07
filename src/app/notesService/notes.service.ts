import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { BehaviorSubject } from 'rxjs';
import { font } from '../roboto/robotoThin';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notesSettingsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({fontSize: 20});

  constructor() {}

  createPDF(a4: HTMLElement, settings: any)
  {
    const pdf = new jsPDF("p", "mm", [297, 210]);

    pdf.addFileToVFS("Roboto-Thin.ttf", font);
    pdf.addFont("Roboto-Thin.ttf", "Roboto-Thin", "normal");
    pdf.setFont("Roboto-Thin");

    const maxWidth = (210 - settings.padding.Left / 3.779528 - settings.padding.Right / 3.779528);

    pdf.setFontSize(settings.fontSize - 4.9);
    pdf.text(a4.innerText, settings.padding.Left / 3.779528, settings.padding.Top / 3.779528 + 4.8, {maxWidth: maxWidth});
    pdf.save("some.pdf");
  }
}