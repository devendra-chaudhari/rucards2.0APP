import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddFundRequestComponent} from "./add-fund-request/add-fund-request.component";
import {MyFundRequestComponent} from "./my-fund-request/my-fund-request.component";
import {PoolBalanceRequestComponent} from "./pool-balance-request/pool-balance-request.component";
import {DownlineFundRequestComponent} from "./downline-fund-request/downline-fund-request.component";
import {TransferBalanceComponent} from "./transfer-balance/transfer-balance.component";
import {RevokeBalanceRequestComponent} from "./revoke-balance-request/revoke-balance-request.component";
import { AddPaymentGatewayComponent } from './add-payment-gateway/add-payment-gateway.component';
import { ViewPgOrdersComponent } from './view-pg-orders/view-pg-orders.component';
import { PgTransactionComponent } from './pg-transaction/pg-transaction.component';
import {
    AddFundWalletTransactionsComponent
} from "./add-fund-wallet-transactions/add-fund-wallet-transactions.component";

const routes: Routes = [
    {path: 'add-fund', component: AddFundRequestComponent},
    {path: 'pool-balance', component: PoolBalanceRequestComponent},
    {path: 'my-fund-request', component: MyFundRequestComponent},
    {path: 'my-downline-request', component: DownlineFundRequestComponent},
    {path: 'transfer-balance', component: TransferBalanceComponent},
    {path: 'revoke-balance', component: RevokeBalanceRequestComponent},
    {path: 'payment-gateway', component:AddPaymentGatewayComponent},
    {path: 'view-pg-orders', component:ViewPgOrdersComponent},
    {path: 'pg-transaction', component:PgTransactionComponent},
    {path: 'add-fund-wallet-transaction', component:AddFundWalletTransactionsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageBalanceRoutingModule {
}
