import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { WhatsNewComponent } from './whats-new/whats-new.component';
import { OrdersComponent } from './orders/orders.component';
import { MealkitComponent } from './mealkit/mealkit.component';

const routes: Routes = [
  {path:"", component:AdminComponent},
  {path:"whatsNew", component:WhatsNewComponent},
  {path:"orders", loadChildren: () => import('../admin/orders/orders.module').then(m => m.OrdersModule)},
  {path:"mealkit", loadChildren: () => import('../admin/mealkit/mealkit.module').then(m => m.MealkitModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
