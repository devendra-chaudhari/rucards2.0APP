import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MasterRoutingModule} from './master-routing.module';
import {MasterComponent} from './master.component';
import {SharedModule} from "../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SimplebarAngularModule} from "simplebar-angular";
import {UiSwitchModule} from "ngx-ui-switch";
import {FlatpickrModule} from "angularx-flatpickr";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";


@NgModule({
    declarations: [
        MasterComponent
    ],
    imports: [
        CommonModule,
        MasterRoutingModule,
        SharedModule,
        NgbModule,
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
        ReactiveFormsModule,
        NgxSpinnerModule
    ]
})
export class MasterModule {
}
