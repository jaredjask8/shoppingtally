import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealkitComponent } from './mealkit.component';

const routes: Routes = [
  {path:"", component:MealkitComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MealkitRoutingModule { }
