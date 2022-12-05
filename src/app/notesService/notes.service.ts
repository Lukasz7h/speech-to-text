import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notesSettingsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({fontSize: 20});

  constructor() {}
}