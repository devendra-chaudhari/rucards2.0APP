import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GprCardTransactionComponent} from "./gpr-card-transaction/gpr-card-transaction.component";

const routes: Routes = [
    {path: 'gpr-card-transaction', component: GprCardTransactionComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportingRoutingModule {
}
