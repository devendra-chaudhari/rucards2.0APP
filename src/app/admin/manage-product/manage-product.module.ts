import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ManageProductRoutingModule} from './manage-product-routing.module';
import {ManageProductComponent} from './manage-product.component';
import {SharedModule} from "../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SimplebarAngularModule} from "simplebar-angular";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {UiSwitchModule} from "ngx-ui-switch";
import {FlatpickrModule} from "angularx-flatpickr";


@NgModule({
    declarations: [
        ManageProductComponent
    ],
    imports: [
        CommonModule,
        ManageProductRoutingModule,
        SharedModule,
        NgbModule,
        SimplebarAngularModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        FormsModule,
        UiSwitchModule.forRoot({
            size: 'small',
            checkedLabel: 'Active',
            uncheckedLabel: 'Inactive',
            defaultBgColor: 'red',
            checkedTextColor: 'white',
            uncheckedTextColor: 'white'
        }),
        FlatpickrModule.forRoot(),
    ]
})
export class ManageProductModule {
}
