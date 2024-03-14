import { TestBed } from '@angular/core/testing';

import { AffiliateService } from './affiliate.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AffiliateService', () => {
  let service: AffiliateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(AffiliateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
