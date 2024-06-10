import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileComponent} from './profile.component';
import {SharedModule} from "../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {FormsModule} from "@angular/forms";
import {CountdownComponent} from "ngx-countdown";
import {NgxSpinnerModule} from "ngx-spinner";
import {SimplebarAngularModule} from "simplebar-angular";


@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        SharedModule,
        NgbModule,
        FormsModule,
        CountdownComponent,
        NgxSpinnerModule,
        SimplebarAngularModule
    ],
})
export class ProfileModule {

}
