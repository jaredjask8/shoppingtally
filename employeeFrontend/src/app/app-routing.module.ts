import { ApplicationConfig, NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { HomeComponent } from 'src/home/home/home.component';
import { RegisterComponent } from 'src/register/register.component';

const routes: Routes = [
	{path: 'home', component:HomeComponent, data: {animation:'homePage'}},
	{path: 'register', component:RegisterComponent, data:{animation:'registerPage'}},
	{path: 'login', loadChildren: () => import('../login/login.module').then(m => m.LoginModule)},
	{ path: 'list', loadChildren: () => import('../list/list_component/list.module').then(m => m.ListModule) },
	{ path: 'employee', loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule) },
	{ path: 'about', loadChildren: () => import('../about/about.module').then(m => m.AboutModule) },
	{ path: 'profile', loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule) },
	{ path: 'reviews', loadChildren: () => import('../reviews/reviews.module').then(m => m.ReviewsModule) },
	{ path: '**', redirectTo: 'home' }
];

export const appConfig: ApplicationConfig = {
	providers: [
	  provideRouter(routes)
	]
  };

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
  })
export class AppRoutingModule { }
