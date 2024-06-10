import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SupportTicketComponent} from "./support-ticket.component";
import {TicketDetailsComponent} from "./ticket-details/ticket-details.component";

const routes: Routes = [
    {path: '', component: SupportTicketComponent},
    {path: 'details', component: TicketDetailsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SupportTicketRoutingModule {
}
