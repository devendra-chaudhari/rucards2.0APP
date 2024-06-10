import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageMapUserRoutingModule } from './manage-map-user-routing.module';
import { ManageMapUserComponent } from './manage-map-user.component';
import {SharedModule} from "../../../shared/shared.module";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SimplebarAngularModule} from "simplebar-angular";


@NgModule({
  declarations: [
    ManageMapUserComponent,
  ],
    imports: [
        CommonModule,
        ManageMapUserRoutingModule,
        SharedModule,
        NgbPagination,
        ReactiveFormsModule,
        SimplebarAngularModule,
        FormsModule,
    ]
})
export class ManageMapUserModule { }
