import { ApplicationConfig, NgModule, inject } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { adminGuard } from 'src/global/utility/admin.guard';
import { loggedInGuard } from 'src/global/utility/logged-in.guard';
import { HomeComponent } from 'src/home/home/home.component';
import { RegisterComponent } from 'src/register/register.component';

const routes: Routes = [
	{path: 'home', component:HomeComponent, data: {animation:'homePage'}},
	{ path: 'list', loadChildren: () => import('../list/list_component/list.module').then(m => m.ListModule),canActivate:[loggedInGuard] },
	{ path: 'previousLists', loadChildren: () => import('../previousLists/previous-lists.module').then(m => m.PreviousListsModule),canActivate:[loggedInGuard] },
	{ path: 'about', loadChildren: () => import('../about/about.module').then(m => m.AboutModule) },
	{ path: 'profile', loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule),canActivate:[loggedInGuard] },
	{ path: 'reviews', loadChildren: () => import('../reviews/reviews.module').then(m => m.ReviewsModule) },
	{ path: 'admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule), canActivate:[adminGuard]}, //, canActivate:[adminGuard]
	{ path: 'mealkit', loadChildren: () => import('../mealkit/mealkit.module').then(m => m.MealkitModule),canActivate:[loggedInGuard] },
	{ path: 'howItWorks', loadChildren: () => import('../how-it-works/how-it-works.module').then(m => m.HowItWorksModule),canActivate:[loggedInGuard] },
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
