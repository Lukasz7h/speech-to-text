import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(NotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('behaviorSubject should had poper first value', () => {
    const list = ['fontSize', 'letterSpacing', 'lineHeight'];

    service.notesSettingsSubject.subscribe((data: []) => {
      expect( list.filter((e) => data.find(x => Object.keys(x)[0] == e)).length ).toEqual(list.length);
    })
  });
});
