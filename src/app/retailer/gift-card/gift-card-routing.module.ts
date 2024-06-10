import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GiftCardComponent} from "./gift-card.component";
import { GiftCardStatementComponent } from './gift-card-statement/gift-card-statement.component';
import { GiftCardsComponent } from './gift-cards/gift-cards.component';
const routes: Routes = [
    {path: '', component: GiftCardComponent},
    {path: 'gift-card-statement', component: GiftCardStatementComponent},
    {path: 'gift-cards', component: GiftCardsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GiftCardRoutingModule {
}
