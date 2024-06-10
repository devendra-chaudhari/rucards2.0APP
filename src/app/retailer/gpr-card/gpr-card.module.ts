import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GprCardRoutingModule} from './gpr-card-routing.module';
import {GprCardComponent} from './gpr-card.component';
import {SharedModule} from "../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SimplebarAngularModule} from "simplebar-angular";
import {FormsModule} from "@angular/forms";
import { GprCardStatementComponent } from './gpr-card-statement/gpr-card-statement.component';
import {UiSwitchModule} from "ngx-ui-switch";


@NgModule({
    declarations: [
        GprCardComponent,
        GprCardStatementComponent
    ],
    imports: [
        CommonModule,
        GprCardRoutingModule,
        SharedModule,
        NgbModule,
        SimplebarAngularModule,
        FormsModule,
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
export class GprCardModule {
}
