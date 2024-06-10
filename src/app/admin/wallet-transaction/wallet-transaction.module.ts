import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletTransactionRoutingModule } from './wallet-transaction-routing.module';
import { AdminWalletTopupComponent } from './admin-wallet-topup/admin-wallet-topup.component';
import {SharedModule} from "../../shared/shared.module";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {SimplebarAngularModule} from "simplebar-angular";
import {UiSwitchModule} from "ngx-ui-switch";
import { UserWiseWalletTransactionsComponent } from './user-wise-wallet-transactions/user-wise-wallet-transactions.component';


@NgModule({
  declarations: [
    AdminWalletTopupComponent,
    UserWiseWalletTransactionsComponent
  ],
    imports: [
        CommonModule,
        WalletTransactionRoutingModule,
        SharedModule,
        NgbPagination,
        ReactiveFormsModule,
        SimplebarAngularModule,
        UiSwitchModule
    ]
})
export class WalletTransactionModule { }
