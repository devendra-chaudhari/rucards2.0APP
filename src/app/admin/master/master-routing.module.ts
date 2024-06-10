import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MasterComponent} from "./master.component";
import {RoleGuard} from "../../shared/guards/role.guard";

const routes: Routes = [
    {path: '', canActivate: [RoleGuard],component: MasterComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MasterRoutingModule {
}
