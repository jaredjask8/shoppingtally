import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderModalComponent } from './order-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrderModalComponent', () => {
  let component: OrderModalComponent;
  let fixture: ComponentFixture<OrderModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderModalComponent, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(OrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
