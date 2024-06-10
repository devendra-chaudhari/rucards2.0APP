import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatinumGiftCardsRoutingModule } from './platinum-gift-cards-routing.module';
import { PlatinumGiftCardsComponent } from './platinum-gift-cards.component';
import {SharedModule} from "../../shared/shared.module";
import {FlatpickrModule} from "angularx-flatpickr";
import {
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgbPagination
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SimplebarAngularModule} from "simplebar-angular";
import {UiSwitchModule} from "ngx-ui-switch";
import {CardNumberFormatPipe} from "../../shared/pipes/card-number-format.pipe";


@NgModule({
  declarations: [
    PlatinumGiftCardsComponent
  ],
    imports: [
        CommonModule,
        PlatinumGiftCardsRoutingModule,
        SharedModule,
        FlatpickrModule,
        NgbDropdown,
        NgbDropdownMenu,
        NgbDropdownToggle,
        NgbPagination,
        ReactiveFormsModule,
        SimplebarAngularModule,
        FormsModule,
        NgbDropdownItem,
        UiSwitchModule.forRoot({
            size: 'small',
            checkedLabel: 'Active',
            uncheckedLabel: 'Inactive',
            defaultBgColor: 'red',
            checkedTextColor: 'white',
            uncheckedTextColor: 'white'
        }),
        CardNumberFormatPipe,
    ]
})
export class PlatinumGiftCardsModule { }
