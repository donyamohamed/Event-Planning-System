import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';

import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';
import { ActivateUserComponent } from '../app/activate-user/activate-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewPasswordComponent } from '../account/new-password/new-password.component';
import { AllGuestComponent } from '@app/guest/all-guest/all-guest.component';
import { CreateGuestComponent } from '@app/guest/create-guest/create-guest.component';
import { DeleteGuestComponent } from '@app/guest/delete-guest/delete-guest.component';
import { GetByIdGuestComponent } from '@app/guest/get-by-id-guest/get-by-id-guest.component';
import { UpdateGuestComponent } from '@app/guest/update-guest/update-guest.component';



@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AccountComponent,
                children: [
                    { path: 'login', component: LoginComponent },
                    { path: 'register', component: RegisterComponent },
                    { path: 'activate/:id', component: ActivateUserComponent },
                    {path :'resetPassword' , component :ResetPasswordComponent},
                    {path:'newPassword' , component :NewPasswordComponent},
                    { path: 'auth-callback', component: AuthCallbackComponent },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }
