import { TestBed } from '@angular/core/testing';

import { MealkitService } from './mealkit.service';

describe('MealkitService', () => {
  let service: MealkitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealkitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
