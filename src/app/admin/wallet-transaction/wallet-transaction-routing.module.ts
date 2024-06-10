import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminWalletTopupComponent} from "./admin-wallet-topup/admin-wallet-topup.component";
import {
  UserWiseWalletTransactionsComponent
} from "./user-wise-wallet-transactions/user-wise-wallet-transactions.component";

const routes: Routes = [
  {path: 'admin-wallet-topup', component: AdminWalletTopupComponent},
  {path: 'user-wise-wallet-transaction', component: UserWiseWalletTransactionsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletTransactionRoutingModule { }
