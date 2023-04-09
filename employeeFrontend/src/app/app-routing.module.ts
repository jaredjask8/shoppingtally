import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: 'list', loadChildren: () => import('../list/list.module').then(m => m.ListModule) },
	{ path: 'employee', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule) },
	{ path: 'about', loadChildren: () => import('../about/about.module').then(m => m.AboutModule) },
	{ path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
