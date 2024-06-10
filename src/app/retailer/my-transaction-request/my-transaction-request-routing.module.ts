import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyTransactionRequestComponent} from "./my-transaction-request.component";

const routes: Routes = [
    {path: '', component: MyTransactionRequestComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyTransactionRequestRoutingModule {
}
