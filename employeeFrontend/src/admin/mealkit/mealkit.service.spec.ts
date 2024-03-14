import { TestBed } from '@angular/core/testing';

import { MealkitService } from './mealkit.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('MealkitService', () => {
  let service: MealkitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        HttpClient,
        HttpHandler
      ]
    });
    service = TestBed.inject(MealkitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
