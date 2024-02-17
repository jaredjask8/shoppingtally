import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { WhatsNewComponent } from './whats-new/whats-new.component';

const routes: Routes = [
  {path:"", component:AdminComponent},
  {path:"whatsNew", component:WhatsNewComponent},
  {path:"orders", loadChildren: () => import('../admin/orders/orders.module').then(m => m.OrdersModule)},
  {path:"mealkit", loadChildren: () => import('../admin/mealkit/mealkit.module').then(m => m.MealkitModule)},
  {path:"affiliate",loadChildren:() => import('../admin/affiliate/affiliate.module').then(m => m.AffiliateModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
