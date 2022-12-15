
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineComponent } from './line.component';

describe('LineComponent', () => {


  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineComponent]
    })
    .compileComponents();
      fixture = TestBed.createComponent(LineComponent);

      component = fixture.debugElement.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data shoud be defined', () => {
    expect(component.data).toBeDefined();
  });

});
