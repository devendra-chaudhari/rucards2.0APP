import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageCorporatesComponent} from "./manage-corporates.component";
import {CreateCorporateComponent} from "./create-corporate/create-corporate.component";
import {EditCorporateComponent} from "./edit-corporate/edit-corporate.component";

const routes: Routes = [
    {path: '', component: ManageCorporatesComponent},
    {path: 'create', component: CreateCorporateComponent},
    {path: ':id/edit', component: EditCorporateComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageCorporatesRoutingModule {
}
