import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentOrderComponent } from './current-order.component';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CurrentOrderComponent', () => {
  let component: CurrentOrderComponent;
  let fixture: ComponentFixture<CurrentOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[CurrentOrderComponent, HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(CurrentOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
