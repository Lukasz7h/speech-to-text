
import { AfterViewInit, Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineComponent } from './line.component';

function checkCharacter(appLine): number
{
  let amountOfCharacter = 0;
  for(let i=0; i<appLine.textContent.length; i++)
  {
    if(appLine.textContent[i] == '|') amountOfCharacter++;
  };

  return amountOfCharacter;
}

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
        currentValue: '{"id":"0","width":"210mm","height":"12px", "top": "-18px"}', // first line-component
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    })

    fixture.detectChanges()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

@Component({
  selector: "app-line-test",
  template: `<app-line data='{"id":"0","width":"210mm","height":"12px", "top": "-18px"}'></app-line>
  <app-line data='{"id": "1", "height": "297mm", "width": "20px", "left": "-18px"}'></app-line>
  `
})
class TestNotesComponent implements AfterViewInit
{
  @Input() data: string;

  ngOnChanges(changes: SimpleChanges | any)
  {
    this.data = changes.data.currentValue;
  }

  ngAfterViewInit(): void
  {}
}