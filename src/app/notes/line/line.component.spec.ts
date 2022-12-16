
import { AfterViewInit, Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineComponent } from './line.component';

describe('LineComponent', async() => {

  let component: TestNotesComponent;
  let fixture: ComponentFixture<TestNotesComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ LineComponent, TestNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestNotesComponent);
    component = fixture.componentInstance;

    component.ngOnChanges({
      data: {
        currentValue: '{"id":"0","width":"210mm","height":"12px", "top": "-18px"}',
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    })

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: "app-line-test",
  template: `<app-line data='{"id":"0","width":"210mm","height":"12px", "top": "-18px"}'></app-line>
  <app-line data='{"id": "1", "height": "297mm", "width": "20px", "left": "-18px"}'></app-line>`
})
class TestNotesComponent implements AfterViewInit
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

    console.log(data);

    appLineElement['style']['width'] = data.width;
    appLineElement['style']['height'] = data.height;

    data.top? 
    [appLineElement['style']['top'] = data.top, this.addLines(210, appLineElement)]:
    [ appLineElement['style']['left'] = data.left, this.addLines(297, appLineElement)];
  }

  addLines(amount: number, element: any): void
  {
    let lines = "";
    for(let i=0; i<amount; i++)
    {
      if(i>0 && i % 10 == 0)
      {
        lines += "<span class='cm'>|</span>";
        continue;
      };

      lines += "|";
    };

    element.insertAdjacentHTML("afterbegin", lines);
  }
}