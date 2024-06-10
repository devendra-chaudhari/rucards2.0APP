import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from './department.component';
import {SimplebarAngularModule} from "simplebar-angular";
import {UiSwitchModule} from "ngx-ui-switch";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FlatpickrModule} from "angularx-flatpickr";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import { DepartmentWiseUserComponent } from './department-wise-user/department-wise-user.component';


@NgModule({
  declarations: [
    DepartmentComponent,
    DepartmentWiseUserComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    DepartmentRoutingModule,
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
    ReactiveFormsModule,
    NgxSpinnerModule

  ]
})
export class DepartmentModule { }
