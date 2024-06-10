import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualRefundRoutingModule } from './manual-refund-routing.module';
import { ManualRefundComponent } from './manual-refund.component';
import {SharedModule} from "../../shared/shared.module";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {SimplebarAngularModule} from "simplebar-angular";
import {UiSwitchModule} from "ngx-ui-switch";

@NgModule({
  declarations: [
    ManualRefundComponent
  ],
    imports: [
        CommonModule,
        ManualRefundRoutingModule,
        SharedModule,
        NgbPagination,
        SimplebarAngularModule,
        UiSwitchModule,
    ]
})
export class ManualRefundModule { }
