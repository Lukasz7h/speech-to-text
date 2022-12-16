import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineComponent } from './line/line.component';
import { NotesComponent } from './notes.component';

describe('NotesComponent', () => {

  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NotesComponent,
        LineComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should had padding elements', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.getElementsByClassName("padding").length).toEqual(4);
  })

  // object settings test
  it('should had paddings', () => {
    const padding = component.settings.padding;
    for(let e in padding)
    {
      expect(padding[`${e}`]).toBeGreaterThanOrEqual(0);
    };
  });

  it('element a4 is had well size', () => {
    const pixelsOfHeight =  Math.floor( (297 * 96) / 25.4);
    const pixelsOfWidth =  Math.floor( (210 * 96) / 25.4);

    function check(x, shouldBe): boolean
    {
      return x - 3 > shouldBe - 5 || x + 3 < shouldBe + 5;
    };

    expect(check(component.element.nativeElement.offsetHeight, pixelsOfHeight)).toBe(true);
    expect(check(component.element.nativeElement.offsetWidth, pixelsOfWidth)).toBe(true);
  });

  it('load line-component', async() => {
    component.ngAfterViewInit();
    fixture.detectChanges();

    expect(document.getElementsByTagName("app-line")).toBeDefined();
  });
  
});
