import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit
{
  constructor(private appService: AppService, private changeDetRef: ChangeDetectorRef){}

  ngAfterViewInit(): void
  {
    this.changeDetRef.detach();
    this.appService.addInstance(document.getElementsByClassName("padding"))

    document.querySelector("app-notes")
    .addEventListener("mousedown", this.appService.mousedownEvent.bind(this.appService));

    document.querySelector("body")
    .addEventListener("mouseup", this.appService.mouseupEvent.bind(this.appService));
  }
}