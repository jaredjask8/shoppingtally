import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { WhatsNewComponent } from './whats-new/whats-new.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {path:"", component:AdminComponent},
  {path:"whatsNew", component:WhatsNewComponent},
  {path:"orders", loadChildren: () => import('../admin/orders/orders.module').then(m => m.OrdersModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
