import { CreateGuestComponent } from './guest/create-guest/create-guest.component';
import { GetByIdGuestComponent } from './guest/get-by-id-guest/get-by-id-guest.component';
import { DeleteGuestComponent } from './guest/delete-guest/delete-guest.component';
import { UpdateGuestComponent } from './guest/update-guest/update-guest.component';
import { AllGuestComponent } from './guest/all-guest/all-guest.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { CreateEventComponent } from 'app/layout/create-event/create-event.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { UserProfileComponent } from './layout/user-profile/user-profile.component';
import {UserEventComponent} from './layout/user-event/user-event.component';





@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                
                    { path: 'home', component: HomeComponent,  canActivate: [AppRouteGuard] },
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
                    { path: 'about', component: AboutComponent, canActivate: [AppRouteGuard] },
                    { path: 'update-password', component: ChangePasswordComponent, canActivate: [AppRouteGuard] },
                    { path: 'create-event', component: CreateEventComponent },
                    

                    {path:'user-event', component:UserEventComponent},

                    {
                        path:"Profile",
                        component:UserProfileComponent,
                        canActivate: [AppRouteGuard] 
                    },
                    {path:'addNewGuest', component: CreateGuestComponent},
                { path: 'allGuests', component: AllGuestComponent, children:[
                { path: 'edit/:id', component: UpdateGuestComponent },
                { path: 'delete/:id', component: DeleteGuestComponent },
                { path: 'showMore/:id', component: GetByIdGuestComponent }
            ]}
            
                ]
               
            }
            
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
