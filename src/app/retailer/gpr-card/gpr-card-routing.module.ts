import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GprCardComponent} from "./gpr-card.component";
import {GprCardStatementComponent} from "./gpr-card-statement/gpr-card-statement.component";

const routes: Routes = [
    {path: '', component: GprCardComponent},
    {path: 'gpr-card-statement/:kit_no/:mobile_no', component: GprCardStatementComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GprCardRoutingModule {
}
