import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ManageCorporatesRoutingModule} from './manage-corporates-routing.module';
import {ManageCorporatesComponent} from './manage-corporates.component';
import {NgbInputDatepicker, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared.module";
import {SimplebarAngularModule} from "simplebar-angular";
import {FlatpickrModule} from "angularx-flatpickr";
import {NgxSpinnerModule} from "ngx-spinner";
import {CreateCorporateComponent} from './create-corporate/create-corporate.component';
import {EditCorporateComponent} from './edit-corporate/edit-corporate.component';
import {CarouselModule} from "ngx-owl-carousel-o";
import {CountdownComponent} from "ngx-countdown";

@NgModule({
    declarations: [
        ManageCorporatesComponent,
        CreateCorporateComponent,
        EditCorporateComponent
    ],
    imports: [
        CommonModule,
        ManageCorporatesRoutingModule,
        SharedModule,
        SimplebarAngularModule,
        NgbInputDatepicker,
        FormsModule,
        FlatpickrModule.forRoot(),
        NgbModule,
        NgxSpinnerModule,
        CarouselModule,
        ReactiveFormsModule,
        CountdownComponent,
    ],
    providers: [
        DatePipe
    ]
})
export class ManageCorporatesModule {

}
