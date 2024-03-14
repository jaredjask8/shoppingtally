import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NavComponent } from 'src/global/nav/nav.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginModalComponent } from '../global/bootstrap-components/login-modal/login-modal.component';
import { RegisterModalComponent } from '../global/bootstrap-components/register-modal/register-modal.component';
import { OrderModalComponent } from '../global/bootstrap-components/order-modal/order-modal.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NavComponent,
        HttpClientTestingModule,
        MatSnackBarModule,
        LoginModalComponent,
        RegisterModalComponent,
        OrderModalComponent
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  
});
