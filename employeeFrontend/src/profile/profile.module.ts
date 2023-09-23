import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { ProfileListsComponent } from './profile-lists/profile-lists.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProfileComponent,
    ProfileUpdateComponent,
    ProfileListsComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    RouterModule
  ]
})
export class ProfileModule { }
