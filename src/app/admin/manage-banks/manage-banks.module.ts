import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageBanksRoutingModule } from './manage-banks-routing.module';
import { ManageBanksComponent } from './manage-banks.component';
import {SharedModule} from "../../shared/shared.module";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {SimplebarAngularModule} from "simplebar-angular";
import {UiSwitchModule} from "ngx-ui-switch";
import {FlatpickrModule} from "angularx-flatpickr";


@NgModule({
  declarations: [
    ManageBanksComponent
  ],
    imports: [
        CommonModule,
        ManageBanksRoutingModule,
        SharedModule,
        NgbPagination,
        ReactiveFormsModule,
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
    ]
})
export class ManageBanksModule { }
