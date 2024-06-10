import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { ManageBalanceRoutingModule } from './manage-balance-routing.module';
import { AddFundRequestComponent } from './add-fund-request/add-fund-request.component';
import { MyFundRequestComponent } from './my-fund-request/my-fund-request.component';
import { TransferBalanceComponent } from './transfer-balance/transfer-balance.component';
import { DownlineFundRequestComponent } from './downline-fund-request/downline-fund-request.component';
import { PoolBalanceRequestComponent } from './pool-balance-request/pool-balance-request.component';
import {FlatpickrModule} from "angularx-flatpickr";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import { RevokeBalanceRequestComponent } from './revoke-balance-request/revoke-balance-request.component';
import { AcceptBalanceRequestComponent } from './accept-balance-request/accept-balance-request.component';
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {UiSwitchModule} from "ngx-ui-switch";
import {SimplebarAngularModule} from "simplebar-angular";
import { AddPaymentGatewayComponent } from './add-payment-gateway/add-payment-gateway.component';
import { ViewPgOrdersComponent } from './view-pg-orders/view-pg-orders.component';
import { PgTransactionComponent } from './pg-transaction/pg-transaction.component';
import { AddFundWalletTransactionsComponent } from './add-fund-wallet-transactions/add-fund-wallet-transactions.component';


@NgModule({
  declarations: [
    AddFundRequestComponent,
    MyFundRequestComponent,
    TransferBalanceComponent,
    DownlineFundRequestComponent,
    PoolBalanceRequestComponent,
    RevokeBalanceRequestComponent,
    AcceptBalanceRequestComponent,
    AddPaymentGatewayComponent,
    ViewPgOrdersComponent,
    PgTransactionComponent,
    AddFundWalletTransactionsComponent
  ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        ManageBalanceRoutingModule,
        ReactiveFormsModule,
        FlatpickrModule.forRoot(),
        SharedModule,
        NgbPagination,
        UiSwitchModule,
        SimplebarAngularModule
    ],
    providers:[DatePipe],
})
export class ManageBalanceModule { }
