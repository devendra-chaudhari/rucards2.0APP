import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageAdvertisementComponent } from './manage-advertisement/manage-advertisement.component';
import { ManageNotificationComponent } from './manage-notification/manage-notification.component';

const routes: Routes = [
  {path: 'manage-advertisement', component:ManageAdvertisementComponent},
  {path: 'manage-notification', component:ManageNotificationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageNotificationsRoutingModule { }
