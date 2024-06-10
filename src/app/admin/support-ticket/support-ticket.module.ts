import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SupportTicketRoutingModule} from './support-ticket-routing.module';
import {SupportTicketComponent} from './support-ticket.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {SimplebarAngularModule} from "simplebar-angular";
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';


@NgModule({
    declarations: [
        SupportTicketComponent,
        TicketDetailsComponent
    ],
    imports: [
        CommonModule,
        SupportTicketRoutingModule,
        NgbModule,
        SharedModule,
        SimplebarAngularModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SupportTicketModule {

}
