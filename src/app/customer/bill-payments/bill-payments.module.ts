import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BillPaymentsRoutingModule} from './bill-payments-routing.module';
import {BillPaymentsComponent} from './bill-payments.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../shared/shared.module";
import {SimplebarAngularModule} from "simplebar-angular";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
    declarations: [
        BillPaymentsComponent
    ],
    imports: [
        CommonModule,
        BillPaymentsRoutingModule,
        NgxSpinnerModule,
        SharedModule,
        SimplebarAngularModule,
        FormsModule,
        NgbModule
    ]
})
export class BillPaymentsModule {
}
