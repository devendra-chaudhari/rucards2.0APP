import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ManageNotificationsComponent} from "./manage-notifications.component";

const routes: Routes = [
  {path: '', component:ManageNotificationsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageNotificationsRoutingModule { }
