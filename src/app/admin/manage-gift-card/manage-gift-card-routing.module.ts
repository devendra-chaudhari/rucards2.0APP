import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorporateLedgerComponent } from './corporate-ledger/corporate-ledger.component';
import { CardsComponent } from './cards/cards.component';

const routes: Routes = [
  {path: 'corporate-ledger', component:CorporateLedgerComponent},
  {path: 'gift-cards', component:CardsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageGiftCardRoutingModule { }
