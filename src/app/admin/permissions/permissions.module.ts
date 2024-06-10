import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PermissionsRoutingModule} from './permissions-routing.module';
import {PermissionsComponent} from './permissions.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {SimplebarAngularModule} from "simplebar-angular";
import {UiSwitchModule} from "ngx-ui-switch";
import {FlatpickrModule} from "angularx-flatpickr";
import {NgxSpinnerModule} from "ngx-spinner";
import {ReactiveFormsModule} from "@angular/forms";
import { EditUserPermissionComponent } from './edit-user-permission/edit-user-permission.component';
import { PermissionControlComponent } from './permission-control/permission-control.component';


@NgModule({
    declarations: [
        PermissionsComponent,
        EditUserPermissionComponent,
        PermissionControlComponent
    ],
    imports: [
        CommonModule,
        PermissionsRoutingModule,
        NgbModule,
        SharedModule,
        SimplebarAngularModule,
        UiSwitchModule.forRoot({
            size: 'small',
            checkedLabel: 'Active',
            uncheckedLabel: 'Inactive',
            defaultBgColor: 'red',
            checkedTextColor: 'white',
            uncheckedTextColor: 'white'
        }),
        FlatpickrModule.forRoot(),
        NgxSpinnerModule,
        SimplebarAngularModule,
        ReactiveFormsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PermissionsModule {

}
