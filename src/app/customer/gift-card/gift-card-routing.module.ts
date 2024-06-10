import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiftCardStatementComponent } from './gift-card-statement/gift-card-statement.component';
import { ManageGiftCardComponent } from './manage-gift-card/manage-gift-card.component';

const routes: Routes = [
  {path:'statement', component:GiftCardStatementComponent},
  {path:'manage-gc', component:ManageGiftCardComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GiftCardRoutingModule { }
