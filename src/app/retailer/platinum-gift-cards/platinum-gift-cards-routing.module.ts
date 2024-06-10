import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlatinumGiftCardsComponent} from "./platinum-gift-cards.component";

const routes: Routes = [
  {path: '', component: PlatinumGiftCardsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatinumGiftCardsRoutingModule { }
