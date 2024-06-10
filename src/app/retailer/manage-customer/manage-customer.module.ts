import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {ManageCustomerRoutingModule} from './manage-customer-routing.module';
import {ManageCustomerComponent} from './manage-customer.component';
import {SharedModule} from "../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CreateCustomerComponent} from './create-customer/create-customer.component';
import {SimplebarAngularModule} from "simplebar-angular";
import {FlatpickrModule} from "angularx-flatpickr";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CountdownComponent} from "ngx-countdown";
import {NgxSpinnerModule} from "ngx-spinner";
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import {UiSwitchModule} from "ngx-ui-switch";
import {NzPaginationComponent} from "ng-zorro-antd/pagination";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {NzDrawerComponent, NzDrawerContentDirective} from "ng-zorro-antd/drawer";
import {NzSpinComponent} from "ng-zorro-antd/spin";



@NgModule({
    declarations: [
        ManageCustomerComponent,
        CreateCustomerComponent,
        EditCustomerComponent
    ],
    imports: [
        CommonModule,
        ManageCustomerRoutingModule,
        NgbModule,
        SimplebarAngularModule,
        FormsModule,
        FlatpickrModule.forRoot(),
        SharedModule,
        CountdownComponent,
        ReactiveFormsModule,
        NgxSpinnerModule,
        UiSwitchModule,
        NzPaginationComponent,
        NzSkeletonComponent,
        NzDrawerComponent,
        NzDrawerContentDirective,
        NzSpinComponent,

    ],
    providers:[DatePipe],
})
export class ManageCustomerModule {
    constructor() {

    }
}
