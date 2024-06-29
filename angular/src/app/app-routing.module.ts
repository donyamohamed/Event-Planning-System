import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from './roles/roles.component';
import { CreateEventComponent } from './layout/create-event/create-event.component';
import { SetExpensesComponent } from './layout/set-expenses/set-expenses.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { UserProfileComponent } from './layout/user-profile/user-profile.component';
import { UserEventComponent } from './layout/user-event/user-event.component';
import { HistoryeventComponent } from './layout/historyevent/historyevent.component';
import { InterstsComponent } from './intersts/intersts.component';
import { TodoListComponent } from './layout/event-todo-list/event-todo-list.component';
import { EventDetailsComponent } from './layout/event-details/event-details.component';
import { EventHOmeDetailsComponent } from './layout/event-home-details/event-home-details.component';

import { InvitationStateComponent } from './layout/invitation-state/invitation-state.component';

import { NotificatiosComponent } from './layout/notifications/notificatios.component';
import { ChatComponentComponent } from './chat-component/chat-component.component';
import { ChatIconComponent } from './chat-icon/chat-icon.component';
import { SidebarEventComponent } from './layout/sidebar-event/sidebar-event.component';
import { ShareDetailesComponent } from './layout/share-detailes/share-detailes.component';
import { PublicEventsComponent } from './home/public-events/public-events.component';
import { NoGuestsComponent } from './guest/no-guests/no-guests.component';
import { CreateGuestComponent } from './guest/create-guest/create-guest.component';
import { GetByIdGuestComponent } from './guest/get-by-id-guest/get-by-id-guest.component';
import { DeleteGuestComponent } from './guest/delete-guest/delete-guest.component';
import { UpdateGuestComponent } from './guest/update-guest/update-guest.component';
import { AllGuestComponent } from './guest/all-guest/all-guest.component';
import { UpcomingEventsComponent } from './layout/user-profile/upcoming-events/upcoming-events.component';

const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            { path: 'Chat/:plannerId', component: ChatComponentComponent },
            { path: 'home', component: HomeComponent },
            { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
            { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
            { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
            { path: 'about', component: AboutComponent },
            { path: 'update-password', component: ChangePasswordComponent, canActivate: [AppRouteGuard] },
            { path: 'create-event', component: CreateEventComponent, canActivate: [AppRouteGuard] },
            { path: 'set-expenses', component: SetExpensesComponent, canActivate: [AppRouteGuard] },
            { path: 'historyevent', component: HistoryeventComponent, canActivate: [AppRouteGuard] },
            { path: 'user-event', component: UserEventComponent, canActivate: [AppRouteGuard] },

            { path: 'invitation-state', component: InvitationStateComponent, canActivate: [AppRouteGuard] },
            { path: 'Profile', component: UserProfileComponent, canActivate: [AppRouteGuard] },
            { path: 'Notifications', component: NotificatiosComponent, canActivate: [AppRouteGuard] },
            { path: 'eventDetails/:id', component: EventDetailsComponent },

            { path: 'shareDetails/:id', component: ShareDetailesComponent, canActivate: [AppRouteGuard] },
            { path: 'todolist/:id', component: TodoListComponent, canActivate: [AppRouteGuard] },
            { path: 'showInterests', component: InterstsComponent, canActivate: [AppRouteGuard] },
            { path: 'addNewGuest', component: CreateGuestComponent, canActivate: [AppRouteGuard] },
            { path: 'eventHomeDetails/:id', component: EventHOmeDetailsComponent },
            { path: 'publicEvents', component: PublicEventsComponent },
            { path: 'ChatIcon', component: ChatIconComponent },
            { path: 'NoGuests/:id', component: NoGuestsComponent, canActivate: [AppRouteGuard] },
            {path:'upcomming-events',component:UpcomingEventsComponent, canActivate: [AppRouteGuard]},
            {
                path: 'allGuests/:id',
                component: AllGuestComponent,
                canActivate: [AppRouteGuard],
                children: [
                    { path: 'edit/:id', component: UpdateGuestComponent, canActivate: [AppRouteGuard] },
                    { path: 'delete/:id', component: DeleteGuestComponent, canActivate: [AppRouteGuard] },
                    { path: 'showMore/:id', component: GetByIdGuestComponent, canActivate: [AppRouteGuard] }
                ]
            },
            { path: 'sidebar-event', component: SidebarEventComponent, canActivate: [AppRouteGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
