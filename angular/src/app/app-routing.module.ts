
// import { NoGuestsComponent } from './guest/no-guests/no-guests.component';

// import { CreateGuestComponent } from './guest/create-guest/create-guest.component';
// import { GetByIdGuestComponent } from './guest/get-by-id-guest/get-by-id-guest.component';
// import { DeleteGuestComponent } from './guest/delete-guest/delete-guest.component';
// import { UpdateGuestComponent } from './guest/update-guest/update-guest.component';
// import { AllGuestComponent } from './guest/all-guest/all-guest.component';
// import { NgModule } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { AppComponent } from './app.component';
// import { AppRouteGuard } from '@shared/auth/auth-route-guard';
// import { HomeComponent } from './home/home.component';
// import { AboutComponent } from './about/about.component';
// import { UsersComponent } from './users/users.component';
// import { TenantsComponent } from './tenants/tenants.component';
// import { RolesComponent } from 'app/roles/roles.component';
// import { CreateEventComponent } from 'app/layout/create-event/create-event.component';
// import { ChangePasswordComponent } from './users/change-password/change-password.component';
// import { UserProfileComponent } from './layout/user-profile/user-profile.component';
// import {UserEventComponent} from './layout/user-event/user-event.component';
// import {HistoryeventComponent} from './layout/historyevent/historyevent.component';
// import {InterstsComponent } from "./intersts/intersts.component";
// import{TodoListComponent} from './layout/event-todo-list/event-todo-list.component'

// import{EventDetailsComponent} from './layout/event-details/event-details.component'





// @NgModule({
//     imports: [
//         RouterModule.forChild([
//             {
//                 path: '',
//                 component: AppComponent,
//                 children: [
                
//                     { path: 'home', component: HomeComponent,  canActivate: [AppRouteGuard] },
//                     { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
//                     { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
//                     { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
//                     { path: 'about', component: AboutComponent, canActivate: [AppRouteGuard] },
//                     { path: 'update-password', component: ChangePasswordComponent, canActivate: [AppRouteGuard] },
//                     { path: 'create-event', component: CreateEventComponent },
//                     {path :'historyevent',component:HistoryeventComponent},
                   



//           {
//             path: "user-event",
//             component: UserEventComponent,
//             // , children:[
//             //     {path:'addNewGuest', component: CreateGuestComponent},
//             //     { path: 'allGuests/:id', component: AllGuestComponent, children:[
//             //     { path: 'edit/:id', component: UpdateGuestComponent },
//             //     { path: 'delete/:id', component: DeleteGuestComponent },
//             //     { path: 'showMore/:id', component: GetByIdGuestComponent }
//             // ]}
//             // ]
//           },



            
//                     {
//                         path:"Profile",
//                         component:UserProfileComponent,
//                         canActivate: [AppRouteGuard] 
//                     },

//                     {path:"eventDetails/:id",component:EventDetailsComponent},

//                   {path:"todolist/:id",component:  TodoListComponent},
//                     { path: "showInterests", component: InterstsComponent },
//                     {path:'addNewGuest', component: CreateGuestComponent},
//                     {path:'NoGuests/:id', component: NoGuestsComponent},
//                 { path: 'allGuests/:id', component: AllGuestComponent, children:[
//                 { path: 'edit/:id', component: UpdateGuestComponent },
//                 { path: 'delete/:id', component: DeleteGuestComponent },
//                 { path: 'showMore/:id', component: GetByIdGuestComponent }
//             ]}
            
//                 ]
               
//             }
            
//         ])
//     ],
//     exports: [RouterModule]



// })
// export class AppRoutingModule {}



import { NoGuestsComponent } from './guest/no-guests/no-guests.component';
import { CreateGuestComponent } from './guest/create-guest/create-guest.component';
import { GetByIdGuestComponent } from './guest/get-by-id-guest/get-by-id-guest.component';
import { DeleteGuestComponent } from './guest/delete-guest/delete-guest.component';
import { UpdateGuestComponent } from './guest/update-guest/update-guest.component';
import { AllGuestComponent } from './guest/all-guest/all-guest.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { CreateEventComponent } from 'app/layout/create-event/create-event.component';
import { SetExpensesComponent } from 'app/layout/set-expenses/set-expenses.component';

import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { UserProfileComponent } from './layout/user-profile/user-profile.component';
import { UserEventComponent } from './layout/user-event/user-event.component';
import { HistoryeventComponent } from './layout/historyevent/historyevent.component';
import { InterstsComponent } from './intersts/intersts.component';
import { TodoListComponent } from './layout/event-todo-list/event-todo-list.component';
import { EventDetailsComponent } from './layout/event-details/event-details.component';
import { NotificatiosComponent } from './layout/notifications/notificatios.component';


const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            { path: 'home', component: HomeComponent, canActivate: [AppRouteGuard] },
            { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
            { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
            { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
            { path: 'about', component: AboutComponent, canActivate: [AppRouteGuard] },
            { path: 'update-password', component: ChangePasswordComponent, canActivate: [AppRouteGuard] },
            { path: 'create-event', component: CreateEventComponent, canActivate: [AppRouteGuard] },
           
            { path: 'set-expenses', component: SetExpensesComponent, canActivate: [AppRouteGuard] },
            
            { path: 'historyevent', component: HistoryeventComponent, canActivate: [AppRouteGuard] },
            { path: 'user-event', component: UserEventComponent, canActivate: [AppRouteGuard] },
            { path: 'Profile', component: UserProfileComponent, canActivate: [AppRouteGuard] },
            { path: 'Notifications', component:NotificatiosComponent , canActivate: [AppRouteGuard] },
            { path: 'eventDetails/:id', component: EventDetailsComponent, canActivate: [AppRouteGuard] },
            { path: 'todolist/:id', component: TodoListComponent, canActivate: [AppRouteGuard] },
            { path: 'showInterests', component: InterstsComponent, canActivate: [AppRouteGuard] },
            { path: 'addNewGuest', component: CreateGuestComponent, canActivate: [AppRouteGuard] },
            { path: 'NoGuests/:id', component: NoGuestsComponent, canActivate: [AppRouteGuard] },
            {
                path: 'allGuests/:id',
                component: AllGuestComponent,
                canActivate: [AppRouteGuard],
                children: [
                    { path: 'edit/:id', component: UpdateGuestComponent, canActivate: [AppRouteGuard] },
                    { path: 'delete/:id', component: DeleteGuestComponent, canActivate: [AppRouteGuard] },
                    { path: 'showMore/:id', component: GetByIdGuestComponent, canActivate: [AppRouteGuard] }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
