import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';
import { InterstsComponent } from '@app/intersts/intersts.component';
import { ChatComponentComponent } from '@app/chat-component/chat-component.component';
import { FeedbackComponent} from './feedback/feedback.component'
// tenants
import { TenantsComponent } from '@app/tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
import { RolesComponent } from '@app/roles/roles.component';
import { CreateRoleDialogComponent } from './roles/create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './roles/edit-role/edit-role-dialog.component';
// users
import { UsersComponent } from '@app/users/users.component';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '@app/users/edit-user/edit-user-dialog.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ResetPasswordDialogComponent } from './users/reset-password/reset-password.component';
// layout
import { HeaderComponent } from './layout/header.component';
import { HeaderLeftNavbarComponent } from './layout/header-left-navbar.component';
import { HeaderLanguageMenuComponent } from './layout/header-language-menu.component';
import { HeaderUserMenuComponent } from './layout/header-user-menu.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarComponent } from './layout/sidebar.component';
import { SidebarLogoComponent } from './layout/sidebar-logo.component';
import { SidebarUserPanelComponent } from './layout/sidebar-user-panel.component';
import { SidebarMenuComponent } from './layout/sidebar-menu.component';
import { BrowserModule } from '@angular/platform-browser';

import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NotificatiosComponent } from "./layout/notifications/notificatios.component";

import { PublicEventsComponent } from "./home/public-events/public-events.component";
import { ChatIconComponent } from "./chat-icon/chat-icon.component";
import { GuestsFeedbackComponent} from './guests-feedback/guests-feedback.component';
import { SearchComponent} from './search/search.component';
import {SuccessPaymentComponent} from './success-payment/success-payment.component'
import {FaildPaymentComponent} from './faild-payment/faild-payment.component'



import {PaymentComponent} from './payment/payment.component'
import {HallsComponent} from './halls/halls.component'


// import { CreateGuestModelComponent } from './guest/create-guest-model/create-guest-model.component';


// import { CalendarModule, DateAdapter } from 'angular-calendar';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        InterstsComponent,
        FeedbackComponent,
        ChatComponentComponent,
        // CreateGuestModelComponent,
        // tenants
        TenantsComponent,
        CreateTenantDialogComponent,
        EditTenantDialogComponent,
        // roles
        RolesComponent,
        CreateRoleDialogComponent,
        EditRoleDialogComponent,
        // users
        UsersComponent,
        CreateUserDialogComponent,
        EditUserDialogComponent,
        ChangePasswordComponent,
        ResetPasswordDialogComponent,
        // layout
        HeaderComponent,
        HeaderLeftNavbarComponent,
        HeaderLanguageMenuComponent,
        HeaderUserMenuComponent,
        FooterComponent,
        SidebarComponent,
        SidebarLogoComponent,
        SidebarUserPanelComponent,
        SidebarMenuComponent,
        GuestsFeedbackComponent,
        PaymentComponent,
        SuccessPaymentComponent,
        FaildPaymentComponent,
        HallsComponent

    ],
    bootstrap: [AppComponent],
    providers: [provideHttpClient(withInterceptorsFromDi(), withJsonpSupport())], imports: [CommonModule,
        FormsModule,
        SearchComponent,
        ReactiveFormsModule,
        HttpClientModule,
        ModalModule.forChild(),
        BsDropdownModule,
        CollapseModule,
        TabsModule,
        AppRoutingModule,
        ServiceProxyModule,
        SharedModule,
        NgxPaginationModule,
        NgbModule,
        FullCalendarModule
        // FullCalendarModule.forRoot({
        //     plugins: [dayGridPlugin]
        //   })
        // CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
        ,
        NotificatiosComponent, PublicEventsComponent, ChatIconComponent] })

export class AppModule {}
