import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';

const routes: Routes = [
  {
    path:'', 
    component:ProfileComponent, 
    children:[
      {path:"update", component:ProfileUpdateComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }