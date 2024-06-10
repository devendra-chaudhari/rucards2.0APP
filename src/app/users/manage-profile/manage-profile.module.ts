import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ManageProfileRoutingModule} from './manage-profile-routing.module';
import {ManageProfileComponent} from './manage-profile.component';
import {SharedModule} from "../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";


@NgModule({
    declarations: [
        ManageProfileComponent
    ],
    imports: [
        CommonModule,
        ManageProfileRoutingModule,
        SharedModule,
        NgbModule,
        ReactiveFormsModule,
        NgxSpinnerModule
    ]
})
export class ManageProfileModule {
}
