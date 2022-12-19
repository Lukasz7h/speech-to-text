import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements AfterViewInit, OnChanges
{
  @Input() data: string;

  ngOnChanges(changes: SimpleChanges | any)
  {
    this.data = changes.data.currentValue;
  }

  ngAfterViewInit(): void
  {
    const data = JSON.parse(this.data);
    const appLineElement = document.getElementsByTagName("app-line").item(data.id);

    appLineElement['style']['width'] = data.width;
    appLineElement['style']['height'] = data.height;

    data.top? 
    [appLineElement['style']['top'] = data.top, this.addLines(210, appLineElement)]:
    [ appLineElement['style']['left'] = data.left, this.addLines(297, appLineElement)];
  }

  addLines(amount: number, element: any): void
  {
    let lines = "";
    if(element.textContent.length > 0) return;

    for(let i=0; i<amount; i++)
    {
      if(i % 10 == 0)
      {
        lines += "<span class='cm'>|</span>";
        continue;
      };

      lines += "|";
    };

    element.insertAdjacentHTML("afterbegin", lines);
    
  }

  
}