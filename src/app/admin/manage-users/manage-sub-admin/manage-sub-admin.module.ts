import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageSubAdminRoutingModule } from './manage-sub-admin-routing.module';
import { ManageSubAdminComponent } from './manage-sub-admin.component';
import {SharedModule} from "../../../shared/shared.module";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SimplebarAngularModule} from "simplebar-angular";


@NgModule({
  declarations: [
    ManageSubAdminComponent
  ],
    imports: [
        CommonModule,
        ManageSubAdminRoutingModule,
        SharedModule,
        NgbPagination,
        ReactiveFormsModule,
        SimplebarAngularModule,
        FormsModule,
    ]
})
export class ManageSubAdminModule { }
