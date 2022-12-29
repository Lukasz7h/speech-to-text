import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { RegisterRouteModule } from './register-route.module';

import { RegisterComponent } from './register.component';
import { RegisterService } from './register.service';

import { CommonModule } from '@angular/common';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RegisterComponent
      ],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RegisterRouteModule,
        HttpClientModule
      ],
      providers: [RegisterService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
