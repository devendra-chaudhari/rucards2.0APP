import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardTransactionRoutingModule } from './card-transaction-routing.module';
import { GiftCardTopupComponent } from './gift-card-topup/gift-card-topup.component';
import {SharedModule} from "../../shared/shared.module";
import {NgbModule, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CardTopupComponent } from './card-topup/card-topup.component';


@NgModule({
  declarations: [
    GiftCardTopupComponent,
    CardTopupComponent,
  ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        CardTransactionRoutingModule,
        SharedModule,
        NgbPagination,
        ReactiveFormsModule
    ]
})
export class CardTransactionModule { }
