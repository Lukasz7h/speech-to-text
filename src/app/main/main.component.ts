import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

import { GuardService } from '../login/guard/guard.service';
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
    this.guard.canActivate();
  }

  ngAfterViewInit(): void
  {
    this.appService.addInstance(document.getElementsByClassName("padding"));

    document.querySelector("app-notes")
    .addEventListener("mousedown", this.appService.mousedownEvent.bind(this.appService));

    document.querySelector("body")
    .addEventListener("mouseup", this.appService.mouseupEvent.bind(this.appService));
  }
}
