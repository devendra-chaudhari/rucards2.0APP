import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageNotificationsRoutingModule } from './manage-notifications-routing.module';
import { ManageNotificationsComponent } from './manage-notifications.component';


@NgModule({
  declarations: [
    ManageNotificationsComponent
  ],
  imports: [
    CommonModule,
    ManageNotificationsRoutingModule
  ]
})
export class ManageNotificationsModule { }
