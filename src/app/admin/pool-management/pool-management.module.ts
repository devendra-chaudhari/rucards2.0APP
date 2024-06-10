import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoolManagementRoutingModule } from './pool-management-routing.module';
import { UserWiseWalletDailyTopupComponent } from './user-wise-wallet-daily-topup/user-wise-wallet-daily-topup.component';
import {AdminWalletDailyTopupComponent} from "./admin-wallet-daily-topup/admin-wallet-daily-topup.component";
import {SharedModule} from "../../shared/shared.module";
import {SimplebarAngularModule} from "simplebar-angular";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import { WalletDailyTopupComponent } from './wallet-daily-topup/wallet-daily-topup.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DailyTransactionsComponent } from './daily-transactions/daily-transactions.component';

@NgModule({
  declarations: [
    UserWiseWalletDailyTopupComponent,
    AdminWalletDailyTopupComponent,
    WalletDailyTopupComponent,
    DailyTransactionsComponent
  ],
    imports: [
        CommonModule,
        PoolManagementRoutingModule,
        SharedModule,
        SimplebarAngularModule,
        NgbPagination,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class PoolManagementModule { }
