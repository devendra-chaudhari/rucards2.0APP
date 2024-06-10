import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {ReportingRoutingModule} from './reporting-routing.module';
import {GprCardTransactionComponent} from './gpr-card-transaction/gpr-card-transaction.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {UiSwitchModule} from "ngx-ui-switch";


@NgModule({
    declarations: [
        GprCardTransactionComponent
    ],
    imports: [
        CommonModule,
        ReportingRoutingModule,
        FormsModule,
        NgbPagination,
        ReactiveFormsModule,
        SharedModule,
        UiSwitchModule
    ],
    providers: [
        DatePipe
    ]
})
export class ReportingModule {
}
