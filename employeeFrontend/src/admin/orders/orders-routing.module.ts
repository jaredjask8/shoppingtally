import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentOrderComponent } from './current-order/current-order.component';
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  {path:"",component:OrdersComponent},
  {path:"currentOrder",component:CurrentOrderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
