import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

import { GuardService } from '../guards/loginGuard/guard.service';
import { IWindow } from '../notesService/notes.service';

import { SaveDocService } from '../server/save-doc.service';
import { LogoutService } from './logout/logout.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit, OnInit
{
  constructor(private appService: AppService, public guard: GuardService, public logoutService: LogoutService, public serverService: SaveDocService){}

  ngOnInit(): void
  {
    this.checkWeb();
  }

  settingButton(): void
  {
    document.getElementById("reveal_settings").addEventListener("click", (e) => {
      document.getElementById("reveal_settings").classList.toggle("move");
      document.querySelector("app-notes-settings").classList.toggle("show");
    });
  }

  ngAfterViewInit(): void
  {
    this.guard.canActivate();
    this.settingButton();

    this.appService.initAllow();

    this.appService.addInstance(document.getElementsByClassName("padding"));

      document.querySelector("app-notes")
      .addEventListener("touchstart", this.appService.mousedownEvent.bind(this.appService));

      document.querySelector("app-notes")
      .addEventListener("mousedown", this.appService.mousedownEvent.bind(this.appService));
  
      document.querySelector("body")
      .addEventListener("mouseup", this.appService.mouseupEvent.bind(this.appService));

      document.querySelector("body")
      .addEventListener("touchend", this.appService.mouseupEvent.bind(this.appService));
  }

  // czy istnieje na stronie objekt dzięki któremu możemy nasłuchiwać to co użytkownik mówi
  checkWeb(): boolean
  {
    const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    return !!webkitSpeechRecognition;
  }
}
