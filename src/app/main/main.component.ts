import { AfterViewInit, Component } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit
{
  constructor(private appService: AppService){}

  ngAfterViewInit(): void
  {
    this.appService.addInstance(document.getElementsByClassName("padding"))

    document.querySelector("app-notes")
    .addEventListener("mousedown", this.appService.mousedownEvent.bind(this.appService));

    document.querySelector("body")
    .addEventListener("mouseup", this.appService.mouseupEvent.bind(this.appService));
  }
}
