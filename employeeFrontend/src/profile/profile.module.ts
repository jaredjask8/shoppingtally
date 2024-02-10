import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PhoneNumberPipe } from '../pipes/phone-number.pipe';
import {MatRippleModule} from '@angular/material/core';


@NgModule({
  declarations: [
    ProfileComponent,
    ProfileUpdateComponent,
    PhoneNumberPipe
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatRippleModule
  ]
})
export class ProfileModule { }
