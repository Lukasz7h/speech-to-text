import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';

import { GuardService } from '../guards/loginGuard/guard.service';
import { SaveDocService } from '../server/save-doc.service';

import { LogoutService } from './logout/logout.service';
import { IWindow } from '../speech/speech.service';

import { fromEvent, merge } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit, OnInit {
  constructor(private appService: AppService, public guard: GuardService, public logoutService: LogoutService, public serverService: SaveDocService) { }

  ngOnInit(): void {
    this.checkWeb();
  }

  @ViewChild("notes")
  notes: ElementRef;

  ngAfterViewInit(): void {
    this.guard.canActivate();
    this.settingButton();

    this.appService.initAllow();

    this.appService.addInstance(document.getElementsByClassName("padding"));

    const notesElement = this.notes.nativeElement;

    merge(
      fromEvent(notesElement, 'mousedown'),
      fromEvent(notesElement, 'touchstart'),

      fromEvent(notesElement, 'mouseup"'),
      fromEvent(notesElement, 'touchend')
    ).subscribe((event: Event) => {

      const diffrantiate = () : string => event.type == "mousedown" || "touchstart"? "mousedownEvent": "mouseupEvent";
      
      this.appService[`${diffrantiate()}`](event.target).bind(this.appService );
    });

  }

  // czy istnieje na stronie objekt dzięki któremu możemy nasłuchiwać to co użytkownik mówi
  public checkWeb(): boolean {
    const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    return !!webkitSpeechRecognition;
  }

  private settingButton(): void {
    document.getElementById("reveal_settings").addEventListener("click", (e) => {
      document.getElementById("reveal_settings").classList.toggle("move");
      document.querySelector("app-notes-settings").classList.toggle("show");
    });
  }


}
