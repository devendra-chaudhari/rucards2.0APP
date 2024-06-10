import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {UiSwitchModule} from "ngx-ui-switch";
import {NgxSpinnerModule} from "ngx-spinner";
import {ReactiveFormsModule} from "@angular/forms";
import {SimplebarAngularModule} from "simplebar-angular";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
    declarations: [
        DashboardComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        NgApexchartsModule,
        UiSwitchModule,
        NgxSpinnerModule,
        ReactiveFormsModule,
        SimplebarAngularModule,
        ClipboardModule,
        SharedModule,
    ]
})
export class DashboardModule {
}
