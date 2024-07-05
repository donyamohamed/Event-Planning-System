import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestsFeedbackComponent } from '@app/guests-feedback/guests-feedback.component';

import { HomeComponent } from '@app/home/home.component';


const routes: Routes = [
  { path: 'app/home', component: HomeComponent },
  {path:'GuestFeedback',component:GuestsFeedbackComponent},
//   { path: '', redirectTo: '/app/showInterests', pathMatch: 'full' },
  { path: '', redirectTo: 'app/home', pathMatch: 'full' }, // Adjusted redirect path
  
  
  // Lazy loading modules
  {
    path: 'app',
    loadChildren: () => import('./app/app.module').then(m => m.AppModule),
    data: { preload: true }
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
    data: { preload: true }
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class RootRoutingModule { }