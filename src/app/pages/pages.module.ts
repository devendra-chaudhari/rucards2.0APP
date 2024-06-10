import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NotFoundComponent} from './not-found/not-found.component';
import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {RegisterComponent} from './register/register.component';
import {PagesRoutingModule} from "./pages-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {CountdownComponent} from "ngx-countdown";
import {NgOtpInputModule} from "ng-otp-input";
import {NgxSpinnerModule} from "ngx-spinner";
import {UiSwitchModule} from "ngx-ui-switch";
import {CarouselModule} from "ngx-owl-carousel-o";
import {ForgotUsernameComponent} from './forgot-username/forgot-username.component';
import {FlatpickrModule} from "angularx-flatpickr";
import {SimplebarAngularModule} from "simplebar-angular";

@NgModule({
    declarations: [
        NotFoundComponent,
        LoginComponent,
        ForgotPasswordComponent,
        RegisterComponent,
        ResetPasswordComponent,
        ForgotUsernameComponent
    ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        CountdownComponent,
        NgOtpInputModule,
        NgxSpinnerModule,
        UiSwitchModule,
        CarouselModule,
        FlatpickrModule.forRoot(),
        SimplebarAngularModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {

}
