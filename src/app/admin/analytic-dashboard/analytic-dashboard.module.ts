import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AnalyticDashboardRoutingModule} from './analytic-dashboard-routing.module';
import {AnalyticDashboardComponent} from './analytic-dashboard.component';
import {FeatherModule} from "angular-feather";
import {allIcons} from "angular-feather/icons";
import {WidgetModule} from "../../shared/widget/widget.module";
import {NgApexchartsModule} from "ng-apexcharts";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SimplebarAngularModule} from "simplebar-angular";
import {UiSwitchModule} from "ngx-ui-switch";


@NgModule({
    declarations: [
        AnalyticDashboardComponent
    ],
    imports: [
        CommonModule,
        AnalyticDashboardRoutingModule,
        FeatherModule.pick(allIcons),
        WidgetModule,
        NgApexchartsModule,
        NgbModule,
        SimplebarAngularModule,
        UiSwitchModule,
    ],

})
export class AnalyticDashboardModule {

}
