import { TestBed } from '@angular/core/testing';

import { NavService } from './nav.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NavService', () => {
  let service: NavService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(NavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
