import { TestBed } from '@angular/core/testing';

import { SaveDocService } from './save-doc.service';

describe('SaveDocService', () => {
  let service: SaveDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
