import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../../shared/shared.module";
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SimplebarAngularModule} from "simplebar-angular";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgbPaginationModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,SimplebarAngularModule,
    NgModule,
  ]
})
export class ManagePromoteRequestsModule { }
