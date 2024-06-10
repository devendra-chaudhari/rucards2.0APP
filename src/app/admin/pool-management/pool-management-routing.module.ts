import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminWalletDailyTopupComponent} from "./admin-wallet-daily-topup/admin-wallet-daily-topup.component";
import {UserWiseWalletDailyTopupComponent} from "./user-wise-wallet-daily-topup/user-wise-wallet-daily-topup.component";
import {WalletDailyTopupComponent} from "./wallet-daily-topup/wallet-daily-topup.component";
import {DailyTransactionsComponent} from "./daily-transactions/daily-transactions.component";

const routes: Routes = [
  {path: 'wallet-daily-topup', component: WalletDailyTopupComponent},
  {path: 'admin-wallet-daily-topup', component: AdminWalletDailyTopupComponent},
  {path: 'user-wise-wallet-daily-transaction', component: UserWiseWalletDailyTopupComponent},
  {path: 'daily-transactions', component: DailyTransactionsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoolManagementRoutingModule { }
