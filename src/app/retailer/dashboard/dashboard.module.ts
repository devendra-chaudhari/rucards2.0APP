import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {SharedModule} from "../../shared/shared.module";
import {WidgetModule} from "../../shared/widget/widget.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgApexchartsModule} from "ng-apexcharts";
import {SimplebarAngularModule} from "simplebar-angular";
import {CarouselModule} from "ngx-owl-carousel-o";


@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        SharedModule,
        WidgetModule,
        NgbModule,
        NgApexchartsModule,
        SimplebarAngularModule,
        CarouselModule
    ],
})
export class DashboardModule {

}
