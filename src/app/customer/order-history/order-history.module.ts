import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderHistoryRoutingModule } from './order-history-routing.module';
import { OrderHistoryComponent } from './order-history.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {SimplebarAngularModule} from "simplebar-angular";


@NgModule({
  declarations: [
    OrderHistoryComponent
  ],
    imports: [
        CommonModule,
        OrderHistoryRoutingModule,
        SharedModule,
        FormsModule,
        NgbDropdown,
        NgbDropdownMenu,
        NgbDropdownToggle,
        NgbPagination,
        SimplebarAngularModule
    ]
})
export class OrderHistoryModule { }
