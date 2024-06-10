import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerRoutingModule } from './partner-routing.module';
import { PartnerComponent } from './partner.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {SimplebarAngularModule} from "simplebar-angular";
import {UiSwitchModule} from "ngx-ui-switch";


@NgModule({
  declarations: [
    PartnerComponent
  ],
    imports: [
        CommonModule,
        PartnerRoutingModule,
        SharedModule,
        FormsModule,
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
    ]
})
export class PartnerModule { }
