import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BillPaymentsComponent} from "./bill-payments.component";

const routes: Routes = [
    {path: '', component: BillPaymentsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillPaymentsRoutingModule {
}
