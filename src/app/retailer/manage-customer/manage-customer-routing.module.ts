import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageCustomerComponent} from "./manage-customer.component";
import {CreateCustomerComponent} from "./create-customer/create-customer.component";

const routes: Routes = [
    {path: '', component: ManageCustomerComponent},
    {path: 'list', component: ManageCustomerComponent},
    {path: 'create', component: CreateCustomerComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageCustomerRoutingModule {
}
