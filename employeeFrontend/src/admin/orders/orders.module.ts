import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { CurrentOrderComponent } from './current-order/current-order.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatButtonModule
  ]
})
export class OrdersModule { }
