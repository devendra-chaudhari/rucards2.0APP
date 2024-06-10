import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RolesComponent} from './roles.component';
import {CarouselModule} from "ngx-owl-carousel-o";
import {SimplebarAngularModule} from "simplebar-angular";
import {RouterModule, Routes} from "@angular/router";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {RoleWiseUsersComponent} from './role-wise-users/role-wise-users.component';
import {RoleDefaultPermissionComponent} from './role-default-permission/role-default-permission.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import { AssignUserPermissionComponent } from './assign-user-permission/assign-user-permission.component';

const routes: Routes = [
    {path: '', component: RolesComponent},
    {path: 'default-permission/:role_id/:role_name', component: RoleDefaultPermissionComponent},
    {path: 'role-wise-users/:role_id/:role_name', component: RoleWiseUsersComponent},
    {path: 'assign-user-permission/:user_id/:user_name', component: AssignUserPermissionComponent}
];

@NgModule({
    declarations: [
        RolesComponent,
        RoleWiseUsersComponent,
        RoleDefaultPermissionComponent,
        AssignUserPermissionComponent
    ],
    imports: [
        CommonModule,
        CarouselModule,
        SimplebarAngularModule,
        RouterModule.forChild(routes),
        NgbPagination,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule
    ],
})


export class RolesModule {
    constructor() {
    }
}
