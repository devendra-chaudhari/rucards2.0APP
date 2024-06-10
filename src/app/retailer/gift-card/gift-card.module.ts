import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GiftCardRoutingModule} from './gift-card-routing.module';
import {GiftCardComponent} from './gift-card.component';
import {SharedModule} from "../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SimplebarAngularModule} from "simplebar-angular";
import { FormsModule } from '@angular/forms';
import { GiftCardStatementComponent } from './gift-card-statement/gift-card-statement.component';
import { GiftCardsComponent } from './gift-cards/gift-cards.component';
import {FlatpickrModule} from "angularx-flatpickr";

@NgModule({
    declarations: [
        GiftCardComponent,
        GiftCardStatementComponent,
        GiftCardsComponent,
    ],
    imports: [
        CommonModule,
        GiftCardRoutingModule,
        SharedModule,
        NgbModule,
        SimplebarAngularModule,
        FormsModule,
        FlatpickrModule.forRoot(),
    ],


})
export class GiftCardModule {
}
