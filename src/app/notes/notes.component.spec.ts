import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesComponent } from './notes.component';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesComponent ]
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
});
