import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageCustomerComponent} from "./manage-customer.component";
import {CreateCustomerComponent} from "./create-customer/create-customer.component";
import {CustomerDetailsComponent} from "./customer-details/customer-details.component";

const routes: Routes = [
    {path: '', component: ManageCustomerComponent},
    {path: 'create', component: CreateCustomerComponent},
    {path: 'details', component: CustomerDetailsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageCustomerRoutingModule {
}
