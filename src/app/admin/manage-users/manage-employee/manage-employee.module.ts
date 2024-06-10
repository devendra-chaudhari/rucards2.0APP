import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageEmployeeRoutingModule } from './manage-employee-routing.module';
import { ManageEmployeeComponent } from './manage-employee.component';
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../../shared/shared.module";
import {SimplebarAngularModule} from "simplebar-angular";
import {UiSwitchModule} from "ngx-ui-switch";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ManageEmployeeComponent
  ],
  imports: [
    CommonModule,
    ManageEmployeeRoutingModule,
    NgbPagination,
    SharedModule,
    SimplebarAngularModule,
    UiSwitchModule,
    ReactiveFormsModule
  ]
})
export class ManageEmployeeModule { }
