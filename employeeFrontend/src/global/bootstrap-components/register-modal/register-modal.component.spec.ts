import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterModalComponent } from './register-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let fixture: ComponentFixture<RegisterModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegisterModalComponent, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(RegisterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
