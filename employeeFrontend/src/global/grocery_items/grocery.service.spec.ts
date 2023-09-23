import { TestBed } from '@angular/core/testing';

import { GroceryService } from './grocery.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GroceryService', () => {
  let service: GroceryService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule]});
    service = TestBed.inject(GroceryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
