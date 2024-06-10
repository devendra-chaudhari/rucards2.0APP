import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageNotificationsRoutingModule } from './manage-notifications-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageAdvertisementComponent } from './manage-advertisement/manage-advertisement.component';
import { ManageNotificationComponent } from './manage-notification/manage-notification.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import {NgxSpinnerModule} from "ngx-spinner";
import {SimplebarAngularModule} from "simplebar-angular";
import { SharedModule } from 'src/app/shared/shared.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FilePondModule } from 'ngx-filepond';



@NgModule({
  declarations: [
    ManageAdvertisementComponent,
    ManageNotificationComponent,


  ],
  imports: [
    CommonModule,
    ManageNotificationsRoutingModule,
    SharedModule,
    NgbModule,
    SimplebarAngularModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule,
    UiSwitchModule.forRoot({
      size: 'small',
      checkedLabel: 'Active',
      uncheckedLabel: 'Inactive',
      defaultBgColor: 'red',
      checkedTextColor: 'white',
      uncheckedTextColor: 'white'
    }),
    FlatpickrModule.forRoot(),
    FilePondModule 
  ]
})
export class ManageNotificationsModule { }
