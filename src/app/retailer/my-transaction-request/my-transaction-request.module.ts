import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MyTransactionRequestRoutingModule} from './my-transaction-request-routing.module';
import {MyTransactionRequestComponent} from './my-transaction-request.component';
import {SharedModule} from "../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
    declarations: [
        MyTransactionRequestComponent
    ],
    imports: [
        CommonModule,
        MyTransactionRequestRoutingModule,
        SharedModule,
        NgbModule
    ]
})
export class MyTransactionRequestModule {
}
