import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SimplebarAngularModule} from "simplebar-angular";
import { FormsModule } from '@angular/forms';

import { ManageGiftCardRoutingModule } from './manage-gift-card-routing.module';
import { CorporateLedgerComponent } from './corporate-ledger/corporate-ledger.component';
import { CardsComponent } from './cards/cards.component';


@NgModule({
  declarations: [
    CorporateLedgerComponent,
    CardsComponent
  ],
  imports: [
    CommonModule,
    ManageGiftCardRoutingModule,
    SharedModule,
    NgbModule,
    SimplebarAngularModule,
    FormsModule
  ]
})
export class ManageGiftCardModule { }
