import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ManageCustomerRoutingModule} from './manage-customer-routing.module';
import {ManageCustomerComponent} from './manage-customer.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../../shared/shared.module";
import {CreateCustomerComponent} from './create-customer/create-customer.component';
import {SimplebarAngularModule} from "simplebar-angular";
import {CustomerDetailsComponent} from './customer-details/customer-details.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {FlatpickrModule} from "angularx-flatpickr";
import {CountdownComponent} from "ngx-countdown";


@NgModule({
    declarations: [
        ManageCustomerComponent,
        CreateCustomerComponent,
        CustomerDetailsComponent
    ],
    imports: [
        CommonModule,
        ManageCustomerRoutingModule,
        NgbModule,
        SharedModule,
        SimplebarAngularModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        FlatpickrModule.forRoot(),
        CountdownComponent,
    ],
    providers: [DatePipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManageCustomerModule {

}
