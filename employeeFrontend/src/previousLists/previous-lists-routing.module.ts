import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileListsComponent } from './profile-lists.component';

const routes: Routes = [{ path: '', component:ProfileListsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreviousListsRoutingModule { }
