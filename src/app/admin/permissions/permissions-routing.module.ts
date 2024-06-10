import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PermissionsComponent} from "./permissions.component";
import {EditUserPermissionComponent} from "./edit-user-permission/edit-user-permission.component";
import {PermissionControlComponent} from "./permission-control/permission-control.component";

const routes: Routes = [
    {path: '', component: PermissionsComponent},
    {path: 'edit-user-permission', component: EditUserPermissionComponent},
    {path: 'permission-control', component: PermissionControlComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PermissionsRoutingModule {
}
