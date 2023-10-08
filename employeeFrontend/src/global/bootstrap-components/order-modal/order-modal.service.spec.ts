import { TestBed } from '@angular/core/testing';

import { OrderModalService } from './order-modal.service';

describe('OrderModalService', () => {
  let service: OrderModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
