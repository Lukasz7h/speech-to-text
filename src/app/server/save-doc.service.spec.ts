import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { SaveDocService } from './save-doc.service';

describe('SaveDocService', () => {
  let service: SaveDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(SaveDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
