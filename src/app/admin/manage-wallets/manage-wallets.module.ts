import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageWalletsRoutingModule } from './manage-wallets-routing.module';
import { ManageWalletsComponent } from './manage-wallets.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {SimplebarAngularModule} from "simplebar-angular";
import {UiSwitchModule} from "ngx-ui-switch";


@NgModule({
  declarations: [
    ManageWalletsComponent
  ],
    imports: [
        CommonModule,
        ManageWalletsRoutingModule,
        SharedModule,
        FormsModule,
        NgbPagination,
        ReactiveFormsModule,
        SimplebarAngularModule,
        UiSwitchModule,UiSwitchModule.forRoot({
            size: 'small',
            checkedLabel: 'Active',
            uncheckedLabel: 'Inactive',
            defaultBgColor: 'red',
            checkedTextColor: 'white',
            uncheckedTextColor: 'white'
        }),
    ]
})
export class ManageWalletsModule { }
