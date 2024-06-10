import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GiftCardRoutingModule } from './gift-card-routing.module';
import { GiftCardStatementComponent } from './gift-card-statement/gift-card-statement.component';
import { ManageGiftCardComponent } from './manage-gift-card/manage-gift-card.component';
import { SharedModule } from "../../shared/shared.module";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgApexchartsModule} from "ng-apexcharts";
import { SimplebarAngularModule } from 'simplebar-angular';
import {FlatpickrModule} from "angularx-flatpickr";


@NgModule({
    declarations: [
        GiftCardStatementComponent,
        ManageGiftCardComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        GiftCardRoutingModule,
        SharedModule,
        NgbPaginationModule,
        NgApexchartsModule,
        SimplebarAngularModule,
        FlatpickrModule.forRoot(),
        NgbDropdown,
        NgbDropdownMenu,
        NgbDropdownToggle,
    ]
})
export class GiftCardModule { }
