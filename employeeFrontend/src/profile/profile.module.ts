import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { ProfileListsComponent } from './profile-lists/profile-lists.component';



@NgModule({
  declarations: [
    ProfileComponent,
    ProfileUpdateComponent,
    ProfileListsComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
