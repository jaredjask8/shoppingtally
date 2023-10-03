import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import { LoginRoutingModule } from './login-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoginModalComponent } from 'src/global/bootstrap-components/login-modal/login-modal.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    LoginModalComponent
  ]
})
export class LoginModule { }
