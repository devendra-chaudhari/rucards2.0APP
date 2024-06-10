import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiftCardTopupComponent } from "./gift-card-topup/gift-card-topup.component";
import {CardTopupComponent} from "./card-topup/card-topup.component";

const routes: Routes = [
  {path: 'gift-card-topup', component: GiftCardTopupComponent},
  {path: 'card-topup', component: CardTopupComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardTransactionRoutingModule { }
